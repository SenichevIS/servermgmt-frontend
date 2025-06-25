import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../models/server.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = 'http://localhost:8080/api/servers';

  constructor(private http: HttpClient) { }

  getServers(): Observable<Server[]> {
    return this.http.get<Server[]>(this.apiUrl);
  }

  getServer(id: number): Observable<Server> {
    return this.http.get<Server>(`${this.apiUrl}/${id}`);
  }

  createServer(server: Server): Observable<Server> {
    return this.http.post<Server>(this.apiUrl, server);
  }

  updateServer(id: number, server: Server): Observable<Server> {
    return this.http.put<Server>(`${this.apiUrl}/${id}`, server);
  }

  deleteServer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchServers(query: string): Observable<Server[]> {
    return this.http.get<Server[]>(`${this.apiUrl}/search?query=${query}`);
  }
}