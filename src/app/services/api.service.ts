import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {LoginComponent} from '../components/login/login.component';

interface LoginResponse {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getLocations(): Observable<any> {
    return this.http.get(this.apiUrl + "/locations", {headers: {Accept: 'application/json'}});
  }

  registerUser(username: string, email: string, password: string) {
    const body = {
      name: username,
      email: email,
      password: password
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + '/api/users/register', body, { headers });
  }

  loginUser(email: string, password: string): Observable<LoginResponse> {
    const body = {
      email: email,
      password: password
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(this.apiUrl + '/api/users/login', body, { headers }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Store token
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<any>{
    localStorage.removeItem('token');
    return this.http.post(this.apiUrl + '/api/users/logout', {});
  }
}
