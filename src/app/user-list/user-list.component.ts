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

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.errorMessage = '';
            },
            error: (error) => {
                this.errorMessage = 'Error fetching users: ' + error;
                console.error(error);
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
                    this.errorMessage = 'Error deleting user: ' + error;
                }
            });
        }
    }
}