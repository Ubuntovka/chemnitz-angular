import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

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

  registerUser(username: string | null | undefined, email: string | null | undefined, password: string | null | undefined) {
    const body = {
      name: username,
      email: email,
      password: password
    };

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.apiUrl + '/api/users/register', body, {headers});
  }

  loginUser(email: string | null, password: string | null): Observable<LoginResponse> {
    const body = {
      email: email,
      password: password
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<LoginResponse>(this.apiUrl + '/api/users/login', body, {headers}).pipe(
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

  logout(): Observable<any> {
    localStorage.removeItem('token');
    return this.http.post(this.apiUrl + '/api/users/logout', {});
  }

  me(): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.getToken()}`
    };

    return this.http.get<any>(this.apiUrl + '/api/users/me', { headers });
  }

  updateUser(oldPassword: string | undefined, name: string | undefined, email: string | undefined, password: string | undefined): Observable<any> {
    const body: any = {};
    body.oldPassword = oldPassword;
    body.name = name;
    body.email = email;
    body.password = password;

    return this.http.patch(this.apiUrl + '/api/users/update', body, {});
  }

  addFavorite(locationId: string) {
    const body = {location: locationId}
    return this.http.post(this.apiUrl + "/api/users/favorite/add", body, {headers: {Accept: 'application/json'}});
  }

  removeFavorite(locationId: string) {
    const body = {location: locationId}
    return this.http.post(this.apiUrl + "/api/users/favorite/remove", body, {headers: {Accept: 'application/json'}});
  }

  favorites(): Observable<any> {
    console.log("service");
    return this.http.get(this.apiUrl + "/api/users/favorites", {});
  }

  addVisited(locationId: string) {
    const body = {location: locationId}
    return this.http.post(this.apiUrl + "/api/users/visited/add", body, {headers: {Accept: 'application/json'}});
  }

  removeVisited(locationId: string) {
    const body = {location: locationId}
    return this.http.post(this.apiUrl + "/api/users/visited/remove", body, {headers: {Accept: 'application/json'}});
  }

  visitedAll(): Observable<any> {
    console.log("service");
    return this.http.get(this.apiUrl + "/api/users/visited/all", {});
  }


}
