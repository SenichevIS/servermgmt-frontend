import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit {
  @Input() standalone: boolean = false;
  @Input() serverId: number | undefined | null = null;
  equipmentList$: Observable<Equipment[]> = of([]);
  errorMessage: string = '';

  constructor(
    private equipmentService: EquipmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('EquipmentListComponent ngOnInit');
    console.log('Server ID input:', this.serverId);
    if (this.serverId != null && this.serverId != undefined) {
      this.loadEquipment();
    } else {
      this.errorMessage = 'Please select a server first';
      this.equipmentList$ = of([]);
    }
  }

  loadEquipment(): void {
    console.log('Loading equipment for server ID:', this.serverId);
    if (this.serverId) {
      this.equipmentList$ = this.equipmentService.getEquipmentByServerId(this.serverId).pipe(
        catchError(error => {
          this.errorMessage = 'Error loading equipment';
          console.error(error);
          return of([]);
        })
      );
    }
  }

  addEquipment(): void {
    if (this.serverId) {
      this.router.navigate(['/equipment/add', this.serverId]);
    }
  }
}