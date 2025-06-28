import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  errorMessage: string = '';
  searchQuery: string = '';
  users: User[] = [];
  filteredUsers: User[] = [];
  emailFilter: string = '';

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
        
        if (response && Array.isArray(response.data)) {
          this.users = response.data;
          this.filteredUsers = [...response.data];

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
  searchUsers(): void {
    if (this.searchQuery.trim()) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.filteredUsers = response;
          } else if (response && Array.isArray(response.data)) {
            this.filteredUsers = response.data;
          }
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Error searching servers: ' + error.message;
        }
      });
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  filterByEmail(): void {
    if (this.emailFilter) {
      this.filteredUsers = this.users.filter(
        user => user.email.toLowerCase().includes(this.emailFilter.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }
}