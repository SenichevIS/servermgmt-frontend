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
    console.log('Fetching all servers from API');
    return this.http.get<Server[]>(this.apiUrl);
  }

  getServer(id: number): Observable<Server> {
    console.log(`Fetching server with id ${id} from API`);
    return this.http.get<Server>(`${this.apiUrl}/${id}`);
  }

  createServer(server: Server): Observable<Server> {
    console.log('Creating new server:', server);
    return this.http.post<Server>(this.apiUrl, server);
  }

  updateServer(id: number, server: Server): Observable<Server> {
    console.log(`Updating server with id ${id}:`, server);
    return this.http.put<Server>(`${this.apiUrl}/${id}`, server);
  }

  deleteServer(id: number): Observable<any> {
    console.log(`Deleting server with id ${id}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchServers(query: string): Observable<Server[]> {
    console.log(`Searching servers with query: ${query}`);
    return this.http.get<Server[]>(`${this.apiUrl}/search?query=${query}`);
  }
}