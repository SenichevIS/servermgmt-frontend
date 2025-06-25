import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SpecificationService } from '../services/specification.service';
import { Specification } from '../models/specification.model';

@Component({
    selector: 'app-specification-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './specification-list.component.html',
    styleUrls: ['./specification-list.component.scss']
})
export class SpecificationListComponent implements OnInit {
    specifications: Specification[] = [];
    errorMessage: string = '';
    @Input() equipmentId: number | null = null;

    constructor(
        private specificationService: SpecificationService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.equipmentId = params['equipmentId'] ? +params['equipmentId'] : null;
            if (this.equipmentId) {
                this.loadSpecifications();
            } else {
                this.errorMessage = 'Equipment ID is missing.';
            }
        });
    }

    loadSpecifications(): void {
        if (this.equipmentId !== null) {
            this.specificationService.getSpecificationsByEquipmentId(this.equipmentId).subscribe({
                next: (specifications) => {
                    this.specifications = specifications;
                    this.errorMessage = '';
                },
                error: (error) => {
                    this.errorMessage = 'Error fetching specifications: ' + error;
                    console.error(error);
                }
            });
        }
    }

    deleteSpecification(id: number): void {
        this.specificationService.deleteSpecification(id).subscribe({
            next: () => {
                this.loadSpecifications();
            },
            error: (error) => {
                this.errorMessage = 'Error deleting specification: ' + error;
            }
        });
    }
}