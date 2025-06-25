import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specification } from '../models/specification.model';

@Injectable({
   providedIn: 'root'
})
export class SpecificationService {
   private apiUrl = 'http://localhost:8080/api/specifications';

   constructor(private http: HttpClient) { }

   getSpecificationsByEquipmentId(equipmentId: number): Observable<Specification[]> {
       return this.http.get<Specification[]>(`${this.apiUrl}/equipment/${equipmentId}`);
   }

   getSpecification(id: number): Observable<Specification> {
       return this.http.get<Specification>(`${this.apiUrl}/${id}`);
   }

   createSpecification(specification: Specification): Observable<Specification> {
       return this.http.post<Specification>(this.apiUrl, specification);
   }

   updateSpecification(id: number, specification: Specification): Observable<Specification> {
       return this.http.put<Specification>(`${this.apiUrl}/${id}`, specification);
   }

   deleteSpecification(id: number): Observable<any> {
       return this.http.delete<any>(`${this.apiUrl}/${id}`);
   }
}