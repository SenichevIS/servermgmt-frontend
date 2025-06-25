import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:8080/api/equipment';

  constructor(private http: HttpClient) { }

  getEquipmentByServerId(serverId: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/server/${serverId}`);
  }

  getEquipmentById(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }

  createEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrl, equipment);
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