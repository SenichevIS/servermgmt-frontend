import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Specification } from '../models/specification.model';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {
  private apiUrl = 'http://localhost:8080/api/specifications';
  private specificationListSubject = new Subject<void>();
  specificationListChanged$ = this.specificationListSubject.asObservable();

  constructor(private http: HttpClient) { }

  getSpecificationsByEquipmentId(equipmentId: number): Observable<Specification[]> {
    return this.http.get<{ data: Specification[] }>(`${this.apiUrl}/equipment/${equipmentId}`).pipe(
      map(response => response.data)
    );
  }

  getSpecificationById(id: number): Observable<Specification> {
      console.log(`Fetching specification with id ${id} from API`);
      return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
        map(response => {
          if (response?.data) {
            return response.data as Specification;
          }
          throw new Error('Invalid specification data format');
        }),
        catchError(error => {
          console.error('Error fetching specification:', error);
          return throwError(() => error);
        })
      );
    }
  
  

  specificationCreated(): void {
    this.specificationListSubject.next();
  }

  createSpecification(specification: Specification): Observable<Specification> {
    return this.http.post<Specification>(this.apiUrl, specification).pipe(
      tap(() => this.specificationListSubject.next())
    );
  }

  updateSpecification(id: number, specification: Specification): Observable<Specification> {
    return this.http.put<Specification>(`${this.apiUrl}/${id}`, specification);
  }

  deleteSpecification(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchSpecification(query: string): Observable<Specification[]> {
    return this.http.get<Specification[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
