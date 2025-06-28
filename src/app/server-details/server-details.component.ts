import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
import { Server } from '../models/server.model';
import { EquipmentListComponent } from '../equipment-list/equipment-list.component';

@Component({
  selector: 'app-server-details',
  standalone: true,
  imports: [CommonModule, EquipmentListComponent],
  templateUrl: './server-details.component.html',
  styleUrls: ['./server-details.component.scss']
})
export class ServerDetailsComponent implements OnInit {
  server: Server | null = null;
  errorMessage: string = '';

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log('Initializing ServerDetailsComponent');
    
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      console.log('Route params:', params);
      console.log('Extracted server ID:', id);

      if (id) {
        this.loadServerDetails(id);
      } else {
        this.errorMessage = 'Server ID is missing';
        console.error('Server ID not found in route params');
      }
    });
  }

  loadServerDetails(id: number): void {
    console.log(`Loading server details for ID: ${id}`);
    
    this.serverService.getServer(id).subscribe({
      next: (server: Server) => {
        console.log('Server data received:', server);
        this.server = server;
      },
      error: (error) => {
        this.errorMessage = 'Error loading server details';
        console.error('Error loading server details:', error);
      }
    });
  }
}