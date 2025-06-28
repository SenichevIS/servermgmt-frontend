import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpecificationService } from '../services/specification.service';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';

@Component({
  selector: 'app-specification-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './specification-form.component.html',
  styleUrls: ['./specification-form.component.scss']
})
export class SpecificationFormComponent implements OnInit {
  specificationForm: FormGroup;
  specificationId: number | null = null;
  equipmentId: number | null = null;
  errorMessage: string = '';
  isSubmitting = false;
  serverId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private specificationService: SpecificationService,
    private equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('SpecificationFormComponent constructor called');
    
    this.specificationForm = this.formBuilder.group({
      specName: ['', Validators.required],
      specValue: ['', Validators.required],
      equipmentId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Initializing SpecificationFormComponent');
    
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      
      this.specificationId = params['id'] ? +params['id'] : null;
      this.equipmentId = params['equipmentId'] ? +params['equipmentId'] : null;
      this.serverId = this.router.getCurrentNavigation()?.extras.state?.['serverId'];
      if (!this.serverId) {
        this.serverId = history.state?.serverId;
      }

      console.log('Mode:', this.specificationId ? 'EDIT' : 'ADD');
      console.log('Specification ID:', this.specificationId);
      console.log('Equipment ID:', this.equipmentId);

      if (this.specificationId) {
        this.loadSpecification(this.specificationId);
      } else if (this.equipmentId) {
        this.specificationForm.patchValue({ equipmentId: this.equipmentId });
      }
    });
  }

  loadSpecification(id: number): void {
    console.log(`Loading specification with ID: ${id}`);
    
    this.specificationService.getSpecificationById(id).subscribe({
      next: (spec) => {
        console.log('Specification loaded:', spec);
        this.specificationForm.patchValue({
          specName: spec.specName,
          specValue: spec.specValue,
          equipmentId: spec.equipmentId
        });
      },
      error: (error) => {
        console.error('Error loading specification:', error);
        this.errorMessage = 'Error loading specification: ' + error.message;
      }
    });
  }

  onSubmit(): void {
    if (this.specificationForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formData = this.specificationForm.value;
    const operation = this.specificationId
      ? this.specificationService.updateSpecification(this.specificationId, formData)
      : this.specificationService.createSpecification(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/equipment', formData.equipmentId]);
      },
      error: (error) => {
        console.error('Operation failed:', error);
        this.errorMessage = `Error ${this.specificationId ? 'updating' : 'creating'} specification`;
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}