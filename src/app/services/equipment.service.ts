import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:8080/api/equipment';
  private equipmentListSubject = new Subject<void>();
  equipmentListChanged$ = this.equipmentListSubject.asObservable();

  constructor(private http: HttpClient) { }

  getEquipments(): Observable<Equipment[]> {
    console.log('Fetching all servers from API');
    return this.http.get<Equipment[]>(this.apiUrl);
  }

  getEquipmentByServerId(serverId: number): Observable<Equipment[]> {
    return this.http.get<{ data: Equipment[] }>(`${this.apiUrl}/server/${serverId}`).pipe(
      map(response => response.data)
    );
  }
  getEquipmentById(id: number): Observable<Equipment> {
    console.log(`Fetching equipment with id ${id} from API`);
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response?.data) {
          return response.data as Equipment;
        }
        throw new Error('Invalid equipment data format');
      }),
      catchError(error => {
        console.error('Error fetching equipment:', error);
        return throwError(() => error);
      })
    );
  }
  

  equipmentCreated(): void {
    this.equipmentListSubject.next();
  }

  createEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrl, equipment).pipe(
      tap(() => this.equipmentListSubject.next())
    );
  }

  updateEquipment(id: number, equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.apiUrl}/${id}`, equipment);
  }

  deleteEquipment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchEquipment(query: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/search?query=${query}`);
  }
}