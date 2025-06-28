import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { ServerService } from '../services/server.service';
import { Server } from '../models/server.model';

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.scss']
})
export class EquipmentFormComponent implements OnInit {
  equipmentForm: FormGroup;
  equipmentId: number | null = null;
  serverId: number | null = null;
  errorMessage: string = '';
  servers: Server[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.equipmentForm = this.formBuilder.group({
      type: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      serverId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadServers();

    this.route.params.subscribe(params => {
      this.equipmentId = params['id'] ? +params['id'] : null;
      this.serverId = params['serverId'] ? +params['serverId'] : null;

      if (this.equipmentId) {
        this.loadEquipment(this.equipmentId);
      } else if (this.serverId) {
        this.equipmentForm.patchValue({
          serverId: this.serverId
        });
      }
    });
  }

  loadServers(): void {
    this.serverService.getServers().subscribe({
      next: (response: any) => { 
        console.log('API response for servers:', response);
        if (Array.isArray(response)) {
          this.servers = response;
        } else if (response && Array.isArray(response.data)) {
          this.servers = response.data;
        }
        else {
            this.errorMessage = "Invalid server response format";
            console.log("Error")
        }
      },
      error: (error) => {
        this.errorMessage = 'Error fetching servers: ' + error;
        console.error(error);
      }
    });
  }

  loadEquipment(id: number): void {
    this.equipmentService.getEquipmentById(id).subscribe({
      next: (equipment) => {
        this.equipmentForm.patchValue({
          type: equipment.type,
          model: equipment.model,
          serialNumber: equipment.serialNumber,
          serverId: equipment.serverId
        });
      },
      error: (error) => {
        this.errorMessage = 'Error fetching equipment: ' + error;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.equipmentForm.valid) {
      const equipmentData = this.equipmentForm.value;
      const serverid = equipmentData.serverId;
  
      if (this.equipmentId) {
        this.equipmentService.updateEquipment(this.equipmentId, equipmentData).subscribe({
          next: () => {
            this.router.navigate(['/servers', serverid]);
          },
          error: (error) => {
            this.errorMessage = 'Error updating equipment: ' + error;
            console.error(error);
          }
        });
      } else {
        this.equipmentService.createEquipment(equipmentData).subscribe({
          next: () => {
            this.router.navigate(['/servers', serverid]);
          },
          error: (error) => {
            this.errorMessage = 'Error creating equipment: ' + error;
            console.error(error);
          }
        });
      }
    }
  }

  trackByFn(index: number, server: Server): number {
    return server.id;
  }
}