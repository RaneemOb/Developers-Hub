import { Component, ViewChild } from "@angular/core";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ChangeDetectorRef, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import { MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { catchError, Observable, of, tap } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { forkJoin } from 'rxjs';
import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
  HttpHeaders,
} from "@angular/common/http";
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: "app-room-page",
  templateUrl: "./room-page.component.html",
  styleUrl: "./room-page.component.css",
  standalone: true,
  imports: [MatCardModule, CommonModule, ReactiveFormsModule, SidebarComponent, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule],
})
export class RoomPageComponent implements OnInit {
  private apiUrl = 'https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/AiIntegration';
  suggestions: SafeHtml | null = null;
  roomId: any;
  room: any;
  roomMembers: any = [];
  UsersInfo: any = [];
  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog,
    private route: ActivatedRoute, private sanitizer: DomSanitizer) { }



  suggestProjectForRoom() {
    if (this.roomId == null || this.roomId === undefined) {
      console.error("User ID is undefined. Cannot fetch suggestions.");
      return;
    }

    this.getRoomSuggestion(this.roomId).subscribe(
      (response: string) => {
        console.log('Suggestions received:', response);
        this.suggestions = this.sanitizer.bypassSecurityTrustHtml(response);  // Sanitize and store the HTML
      },
      (error) => {
        console.error("Error fetching suggestions:", error);
      }
    );
  }
  public getRoomSuggestion(roomId: number, message: string | null = null): Observable<string> {
    const token = sessionStorage.getItem('token'); // Get token from sessionStorage

    if (!token) {
      console.error('No token found in sessionStorage');
      return new Observable<string>(); // Return empty observable if no token
    }

    // Construct the URL with userId (from the URL)
    const url = `${this.apiUrl}/${roomId}/SuggestRoomProject`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Prepare the body with optional message
    const body = { message: message }; // Only include message in the body, if provided

    // Send POST request with body containing message and get response as text
    return this.http.post(url, body, { headers, responseType: 'text' as 'json' }).pipe(
      tap((response: any) => {
        console.log('Received response:', response);  // This will now log the raw HTML
      }),
      catchError((error) => {
        console.error('Error fetching suggestions:', error);
        throw error;  // Rethrow the error so it's handled in the component
      })
    );
  }


  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId'); // Get room ID from URL
    if (this.roomId) {
      this.getRoomById(this.roomId);
    }
    this.getRoomById(this.roomId).subscribe(
      (response: any) => {
        console.log(response);

        if (response && response.data) {  // Check if response.data exists
          const room = response.data;
          this.room = {
            id: room.id,
            name: room.name,
            description: room.description,
            createdAt: room.createdAt
          };
        } else {
          console.error("Unexpected response structure:", response);
        }
      },
      (error) => {
        console.error("Error fetching Room: ", error);
      }
    );
    this.getRoomMembers(this.roomId).subscribe(
      (response: any) => {
        if (response.data) {
          // Map the response to the required structure
          this.roomMembers = response.data.map((member: any) => ({
            id: member.id,
            name: member.name,
            email: member.email,
            bio: member.bio
          }));

          console.log("room members :", this.roomMembers);  // Log the mapped room members

        } else {
          console.error("Unexpected response structure:", response);
        }
      },
      (error) => {
        console.error("Error fetching room members:", error);
      }
    );
  }
  getRoomById(roomId: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return of(null);  // You might want to handle this case properly.
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Rooms/GetById/${roomId}`,
      { headers }
    );
  }

  // Get Room Members
  getRoomMembers(roomId: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return of([]);  // Handle appropriately
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(
      `https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Rooms/GetUsersDetailsDataInRoomByRoomId/${roomId}`,
      { headers }
    );
  }

  // Get User Info by ID
  getUserInfoById(userId: number) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return of(null);   // Handle appropriately
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Users/GetById/${userId}`,
      { headers }
    );
  }
  suggestProject(): void {
    console.log("Suggesting project for room");
    // Implement project suggestion logic
  }

  suggestWorkPlan(): void {
    console.log("Suggesting work plan");
    // Implement work plan suggestion logic
  }
}
