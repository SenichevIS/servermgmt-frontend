import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { User } from '../models/user.model';
import { UserRegistrationDTO } from '../models/user-registration.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUser(id: number): Observable<User> {
      console.log(`Fetching user with id ${id} from API`);
      return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
        map(response => {
          if (response?.data) {
            return response.data as User;
          }
          throw new Error('Invalid user data format');
        }),
        catchError(error => {
          console.error('Error fetching user:', error);
          return throwError(() => error);
        })
      );
    }

    createUser(user: UserRegistrationDTO): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
    searchUsers(query: string): Observable<User[]> {
      console.log(`Searching users with query: ${query}`);
      return this.http.get<User[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
    }
}