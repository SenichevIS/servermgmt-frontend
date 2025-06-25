import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecificationService } from '../services/specification.service';
import { Specification } from '../models/specification.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-specification-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Добавьте RouterLink
  templateUrl: './specification-form.component.html',
  styleUrls: ['./specification-form.component.scss']
})
export class SpecificationFormComponent implements OnInit {
  specificationForm: FormGroup;
  equipmentId: number | null = null;
  specificationId: number | null = null;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private specificationService: SpecificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.specificationForm = this.formBuilder.group({
      specName: ['', Validators.required],
      specValue: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.equipmentId = params['equipmentId'] ? +params['equipmentId'] : null;
      this.specificationId = params['id'] ? +params['id'] : null;

      if (this.specificationId) {
        this.loadSpecification(this.specificationId);
      } else if (this.equipmentId) {
        this.specificationForm.patchValue({
          equipmentId: this.equipmentId
        });
      }
    });
  }

  loadSpecification(id: number): void {
    this.specificationService.getSpecification(id).subscribe({
      next: (specification) => {
        this.specificationForm.patchValue({
          specName: specification.specName,
          specValue: specification.specValue
        });
      },
      error: (error) => {
        this.errorMessage = 'Error fetching specification: ' + error;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.specificationForm.valid) {
      const specificationData = this.specificationForm.value;

      if (this.specificationId) {
        this.specificationService.updateSpecification(this.specificationId, specificationData).subscribe({
          next: () => {
            this.router.navigate(['/equipment', specificationData.equipmentId, 'specifications']);
          },
          error: (error) => {
            this.errorMessage = 'Error updating specification: ' + error;
            console.error(error);
          }
        });
      } else if (this.equipmentId) {
        specificationData.equipmentId = this.equipmentId;  // Correctly set equipmentId
        this.specificationService.createSpecification(specificationData).subscribe({
          next: () => {
            this.router.navigate(['/servers']);
          },
          error: (error) => {
            this.errorMessage = 'Error creating specification: ' + error;
            console.error(error);
          }
        });
      }
    }
  }
  getSpecification(id: number) {
    throw new Error('Method not implemented.');
  }
}
