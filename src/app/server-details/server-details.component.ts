import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServerService } from '../services/server.service';
import { Server } from '../models/server.model';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-server-details',
  standalone: true,
  imports: [CommonModule, RouterLink, EquipmentListComponent],
  templateUrl: './server-details.component.html',
  styleUrls: ['./server-details.component.scss']
})
export class ServerDetailsComponent implements OnInit {
  server: Server | null = null;
  owner: User | null = null;
  errorMessage: string = '';

  constructor(
    private serverService: ServerService,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      if (id) {
        this.loadServerDetails(id);
      } else {
        this.errorMessage = 'Server ID is missing.';
      }
    });
  }

  loadServerDetails(id: number): void {
    this.serverService.getServer(id).subscribe({
      next: (server) => {
        this.server = server;
        if (server.ownerId) {
          this.loadOwnerDetails(server.ownerId);
        }
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error fetching server details: ' + error;
        console.error(error);
      }
    });
  }

  loadOwnerDetails(ownerId: number): void {
    this.userService.getUser(ownerId).subscribe({
      next: (user) => {
        this.owner = user;
      },
      error: (error) => {
        console.error('Error fetching owner details:', error);
      }
    });
  }
}