import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://hackathon-ramadan.runasp.net/api/Auth/LoginUserByEmailAndPassword';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          // Store token in sessionStorage
          sessionStorage.setItem('token', response.token);

          // Decode token and store nameIdentifier
          const decodedToken: any = this.decodeToken();
          if (decodedToken) {
            const nameIdentifier = Number(decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
            if (!isNaN(nameIdentifier)) {
              sessionStorage.setItem('nameIdentifier', nameIdentifier.toString());
            }
          }
        }
      })
    );
  }

  decodeToken(): any {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token);  // Decode and return the JWT payload
      } catch (error) {
        console.error('Error decoding JWT', error);
        return null;
      }
    }
    return null;
  }

  getUserInfo(): number | null {
    const nameIdentifier = sessionStorage.getItem('nameIdentifier');
    return nameIdentifier ? Number(nameIdentifier) : null;
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nameIdentifier');
  }
}
