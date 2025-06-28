import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { server } from 'typescript';

@Component({
    selector: 'app-equipment-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './equipment-list.component.html',
    styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit, OnDestroy {
    @Input() standalone: boolean = false;
    @Input() serverId: number | undefined | null = null;
    equipmentList$: Observable<Equipment[]> = of([]);
    filteredEquipment$: Observable<Equipment[]> = of([]);
    errorMessage: string = '';
    private equipmentListChangedSubscription: Subscription | undefined;
    searchQuery: string = '';
    equipmentList: Equipment[] = [];
    filteredEquipment: Equipment[] = [];
    modelFilter: string = '';

    constructor(
        private equipmentService: EquipmentService,
        private router: Router
    ) { }

    ngOnInit(): void {
        console.log('EquipmentListComponent ngOnInit');
        console.log('Server ID input:', this.serverId);
        this.equipmentListChangedSubscription = this.equipmentService.equipmentListChanged$.subscribe(() => {
            if (this.serverId != null && this.serverId != undefined) {
                this.loadEquipment();
            }
        });
        if (this.serverId != null && this.serverId != undefined) {
            this.loadEquipment();
        } else {
            this.errorMessage = 'Please select a server first';
            this.equipmentList$ = of([]);
        }
    }

    ngOnDestroy(): void {
        if (this.equipmentListChangedSubscription) {
            this.equipmentListChangedSubscription.unsubscribe();
        }
    }

    loadEquipment(): void {
      console.log('Loading equipment for server ID:', this.serverId);
      if (this.serverId) {
        this.equipmentService.getEquipmentByServerId(this.serverId).pipe(
          tap(equipment => console.log('Equipment data:', equipment)),
          catchError(error => {
            this.errorMessage = 'Error loading equipment';
            console.error(error);
            return of([]);
          })
        ).subscribe(equipmentArray => {
          this.equipmentList = equipmentArray; 
          this.filteredEquipment = [...this.equipmentList];
        });
      }
    }

    addEquipment(): void {
        if (this.serverId) {
            this.router.navigate(['/equipment/add', this.serverId]);
        }
    }
    deleteEquipment(id: number): void {
      this.equipmentService.deleteEquipment(id).subscribe(() => {
        this.loadEquipment();
      }, error => {
        console.error('Ошибка при удалении оборудования', error);
      });
    }

    navigateToList(equipmentId: number) {
      this.router.navigate(['/equipment', equipmentId], {
        state: { serverId: this.serverId }
      });
    }

    searchEquipments(): void {
      if (this.searchQuery.trim()) {
        this. equipmentService.searchEquipment(this.searchQuery).subscribe({
          next: (response: any) => {
            if (response && Array.isArray(response.data)) {
              this.filteredEquipment = response.data;
            }
            this.errorMessage = '';
          },
          error: (error) => {
            this.errorMessage = 'Error searching servers: ' + error.message;
          }
        });
      } else {
        this.filteredEquipment = [...this.equipmentList];
      }
    }
  
    filterByLocation(): void {
      if (this.modelFilter) {
        this.filteredEquipment = this.equipmentList.filter(
          server => server.model.toLowerCase().includes(this.modelFilter.toLowerCase())
        );
      } else {
        this.filteredEquipment = [...this.equipmentList];
      }
    }
}