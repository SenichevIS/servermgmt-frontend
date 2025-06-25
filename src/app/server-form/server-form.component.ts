import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { Server } from '../models/server.model';

@Component({
  selector: 'app-server-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.scss']
})
export class ServerFormComponent implements OnInit {
  serverForm: FormGroup;
  serverId: number | null = null;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.serverForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serverId = params['id'] ? +params['id'] : null;
      if (this.serverId) {
        this.loadServer(this.serverId);
      }
    });
  }

  loadServer(id: number): void {
    this.serverService.getServer(id).subscribe({
      next: (server) => {
        this.serverForm.patchValue({
          name: server.name,
          location: server.location
        });
      },
      error: (error) => {
        this.errorMessage = 'Error fetching server: ' + error;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.serverForm.valid) {
      const serverData: Server = this.serverForm.value;

      if (this.serverId) {
        this.serverService.updateServer(this.serverId, serverData).subscribe({
          next: () => {
            this.router.navigate(['/servers']);
          },
          error: (error) => {
            this.errorMessage = 'Error updating server: ' + error;
            console.error(error);
          }
        });
      } else {
        this.serverService.createServer(serverData).subscribe({
          next: () => {
            this.router.navigate(['/servers']);
          },
          error: (error) => {
            this.errorMessage = 'Error creating server: ' + error;
            console.error(error);
          }
        });
      }
    }
  }
}