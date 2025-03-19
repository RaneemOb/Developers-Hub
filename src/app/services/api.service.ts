
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://hackathon-ramadan.runasp.net/'; // Base URL

  constructor(private http: HttpClient) { }
  getAllDevelopers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Users/GetAll`);
  }
}
