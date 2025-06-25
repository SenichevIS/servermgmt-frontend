import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';

@Component({
    selector: 'app-equipment-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './equipment-list.component.html',
    styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit {
    equipmentList: Equipment[] = [];
    errorMessage: string = '';
    @Input() serverId: number | null = null;

    constructor(
        private equipmentService: EquipmentService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.serverId = params['serverId'] ? +params['serverId'] : null;
            if (this.serverId) {
                this.loadEquipment();
            } else {
                this.errorMessage = 'Server ID is missing.';
            }
        });
    }

    loadEquipment(): void {
        if (this.serverId !== null) {
            this.equipmentService.getEquipmentByServerId(this.serverId).subscribe({
                next: (equipment) => {
                    this.equipmentList = equipment;
                    this.errorMessage = '';
                },
                error: (error) => {
                    this.errorMessage = 'Error fetching equipment: ' + error;
                    console.error(error);
                }
            });
        }
    }

    deleteEquipment(id: number): void {
        this.equipmentService.deleteEquipment(id).subscribe({
            next: () => {
                this.loadEquipment();
            },
            error: (error) => {
                this.errorMessage = 'Error deleting equipment: ' + error;
            }
        });
    }
}