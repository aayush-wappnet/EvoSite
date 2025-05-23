import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }).pipe(
      map((response: any) => {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        return response;
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
