import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server } from '../models/server.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private apiUrl = 'http://localhost:8080/api/servers';

  constructor(private http: HttpClient) { }

  getServer(id: number): Observable<Server> {
    console.log(`Fetching server with id ${id} from API`);
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response?.data) {
          return response.data as Server;
        }
        throw new Error('Invalid server data format');
      }),
      catchError((error: any) => {
        console.error('Error fetching server:', error);
        throw error;
      })
    );
  }

  getServers(): Observable<Server[]> {
    console.log('Fetching all servers from API');
    return this.http.get<Server[]>(this.apiUrl);
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