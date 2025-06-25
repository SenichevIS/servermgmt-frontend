import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserRegistrationDTO } from '../models/user-registration.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  errorMessage: string = '';
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      role: ['USER', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'] ? +params['id'] : null;
      this.isEditMode = !!this.userId;

      if (this.userId) {
        this.loadUser(this.userId);
        this.passwordControl?.removeValidators(Validators.required); 
        this.passwordControl?.updateValueAndValidity();
      } else {
        this.passwordControl?.addValidators(Validators.required);
        this.passwordControl?.updateValueAndValidity();
      }
    });
  }

  loadUser(id: number): void {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role
        });
      },
      error: (error) => {
        this.errorMessage = 'Error fetching user: ' + error;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.userId) {
        // Update user
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (error) => {
            this.errorMessage = 'Error updating user: ' + error;
            console.error(error);
          }
        });
      } else {
        // Create user
        const userRegistrationData: UserRegistrationDTO = {
          username: userData.username,
          email: userData.email,
          password: userData.password
        };

        this.userService.createUser(userRegistrationData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (error) => {
            this.errorMessage = 'Error creating user: ' + error;
            console.error(error);
          }
        });
      }
    }
  }

  get passwordControl() {
    return this.userForm.get('password');
  }
}