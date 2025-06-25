import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServerService } from '../services/server.service';
import { Server } from '../models/server.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-server-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit {
  servers: Server[] = [];
  filteredServers: Server[] = [];
  errorMessage: string = '';
  searchQuery: string = '';
  locationFilter: string = '';

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.serverService.getServers().subscribe({
      next: (servers) => {
        this.servers = servers;
        this.filteredServers = [...servers];
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error fetching servers: ' + error;
        console.error(error);
      }
    });
  }

  searchServers(): void {
    if (this.searchQuery.trim()) {
      this.serverService.searchServers(this.searchQuery).subscribe({
        next: (servers) => {
          this.filteredServers = servers;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Error searching servers: ' + error;
          console.error(error);
        }
      });
    } else {
      this.filteredServers = [...this.servers];
    }
  }

  filterByLocation(): void {
    if (this.locationFilter) {
      this.filteredServers = this.servers.filter(
        server => server.location.toLowerCase().includes(this.locationFilter.toLowerCase())
      );
    } else {
      this.filteredServers = [...this.servers];
    }
  }

  deleteServer(id: number): void {
    if (confirm('Are you sure you want to delete this server?')) {
      this.serverService.deleteServer(id).subscribe({
        next: () => {
          this.loadServers();
        },
        error: (error) => {
          this.errorMessage = 'Error deleting server: ' + error;
        }
      });
    }
  }
}