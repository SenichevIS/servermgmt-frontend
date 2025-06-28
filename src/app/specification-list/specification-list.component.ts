import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpecificationService } from '../services/specification.service';
import { Specification } from '../models/specification.model';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, startWith, tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-specification-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './specification-list.component.html',
  styleUrls: ['./specification-list.component.scss']
})
export class SpecificationListComponent implements OnInit, OnDestroy {
  @Input() standalone: boolean = false;
  @Input() equipmentId: number | undefined | null = null;

  specificationList$: Observable<Specification[]> = of([]);
  errorMessage: string = '';
  private specificationListChangedSubscription: Subscription | undefined;
  serverId?: number;
  searchQuery: string = '';
  specificationList: Specification[] = [];
  filteredSpecification: Specification[] = [];
  modelFilter: string = '';

  constructor(
    private specificationService: SpecificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const id = paramMap.get('equipmentId') || paramMap.get('id');
      this.serverId = this.router.getCurrentNavigation()?.extras.state?.['serverId'];
      if (!this.serverId) {
        this.serverId = history.state?.serverId;
      }

       console.log('Server ID:', this.serverId);

  
      if (id && !isNaN(+id)) {
        this.equipmentId = +id;
        console.log('Valid Equipment ID:', this.equipmentId);
        this.loadSpecifications();
      } else {
        console.error('Invalid Equipment ID:', id);
        this.errorMessage = 'Invalid equipment identifier';
      }
    });
  }
  


  ngOnDestroy(): void {
    this.specificationListChangedSubscription?.unsubscribe();
  }

  loadSpecifications(): void {
    console.log('Loading specifications for equipment ID:', this.equipmentId);
    if (this.equipmentId) {
      this.errorMessage = '';
      this.specificationService.getSpecificationsByEquipmentId(this.equipmentId).pipe(
        tap(specs => console.log('Specifications data:', specs)),
        catchError(error => {
          this.errorMessage = 'Error loading specifications';
          console.error(error);
          return of([]);
        })
      ).subscribe(specsArray => {
        this.specificationList = specsArray;
        this.filteredSpecification = [...specsArray];
      });
    }
  }

  addSpecification(): void {
    if (this.equipmentId) {
      this.router.navigate(['/specifications/add', this.equipmentId]);
    }
  }

  deleteSpecification(id: number): void {
    this.specificationService.deleteSpecification(id).subscribe({
      next: () => this.loadSpecifications(),
      error: err => {
        this.errorMessage = 'Error deleting specification';
        console.error(err);
      }
    });
  }

  searchSpecification(): void {
    if (this.searchQuery.trim()) {
      this. specificationService.searchSpecification(this.searchQuery).subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response.data)) {
            this.filteredSpecification = response.data;
          }
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Error searching servers: ' + error.message;
        }
      });
    } else {
      this.filteredSpecification = [...this.specificationList];
    }
  }

  filterByLocation(): void {
    if (this.modelFilter) {
      this.filteredSpecification = this.specificationList.filter(
        item => item.specValue.toLowerCase().includes(this.modelFilter.toLowerCase())
      );
    } else {
      this.filteredSpecification = [...this.specificationList];
    }
  }
}