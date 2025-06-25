import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
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
  equipmentId: number | null = null;

  constructor(
    private specificationService: SpecificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const equipmentIdParam = params.get('equipmentId');
      this.equipmentId = equipmentIdParam ? +equipmentIdParam : null;
      
      if (this.equipmentId) {
        this.loadSpecifications();
      } else {
        this.errorMessage = 'Please select equipment first';
      }
    });
  }

  loadSpecifications(): void {
    if (this.equipmentId) {
      this.specificationService.getSpecificationsByEquipmentId(this.equipmentId)
        .subscribe({
          next: (specs) => {
            this.specifications = specs;
            this.errorMessage = '';
          },
          error: (error) => {
            this.errorMessage = 'Error loading specifications: ' + error.message;
          }
        });
    }
  }

  navigateToEquipment(): void {
    if (this.equipmentId) {
      this.router.navigate(['/equipment', this.equipmentId]);
    } else {
      this.router.navigate(['/equipment']);
    }
  }
}