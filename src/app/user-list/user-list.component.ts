import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  errorMessage: string = '';

  constructor(private userService: UserService) {
    console.log('UserListComponent constructor');
  }

  ngOnInit(): void {
    console.log('UserListComponent ngOnInit');
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Loading users...');
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        console.log('Users response:', response);
        
        // Обрабатываем разные форматы ответа
        if (Array.isArray(response)) {
          this.users = response;
        } else if (response && Array.isArray(response.data)) {
          this.users = response.data;
        } else if (response && Array.isArray(response.users)) {
          this.users = response.users;
        } else {
          this.errorMessage = 'Invalid users data format';
          console.error('Invalid users data:', response);
        }
        
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error loading users: ' + error.message;
        console.error('Error loading users:', error);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Error deleting user: ' + error.message;
        }
      });
    }
  }
}