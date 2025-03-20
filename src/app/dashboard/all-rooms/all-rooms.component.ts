import { Component, ViewChild } from "@angular/core";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ChangeDetectorRef, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import { MatDialogClose, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Observable, switchMap } from "rxjs";
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

@Component({
  selector: "app-all-rooms",
  standalone: true,
  imports: [MatDialogContent, MatCardModule, CommonModule, ReactiveFormsModule, SidebarComponent, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./all-rooms.component.html",
  styleUrl: "./all-rooms.component.css",
})
export class AllRoomsComponent implements OnInit {
  @ViewChild('CreateRoom') Create: any
  createRoomForm!: FormGroup;
  allRooms: any[] = [];
  private apiUrl = 'http://hackathon-ramadan.runasp.net/api/Rooms/CreateRoom';
  updatedRooms: any[] | undefined;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog, private route: ActivatedRoute) {
    this.createRoomForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.getAllRooms().subscribe(
      (response: any) => {
        console.log(response);


        if (response.data) {
          this.allRooms = response.data.map((room: { name: any; description: any; createdAt: any; id: any }) => ({
            id: room.id,
            name: room.name,
            description: room.description,
            createdAt: room.createdAt
          }));
          this.updatedRooms = [...this.allRooms];
          this.cdRef.detectChanges();
        } else {
          console.error("Unexpected response structure:", response);
          this.allRooms = [];
        }
      },
      (error) => {
        console.error("Error fetching rooms:", error);
      }
    );
  }
  getAllRooms(): Observable<any[]> {
    return this.http.get<any[]>(
      "http://hackathon-ramadan.runasp.net/api/Rooms/GetAll",

    );

  }
  trackById(index: number, room: any): string {
    return room?.id ?? index.toString(); // Use index as fallback if id is missing
  }
  onRoomClick(roomid: number) {
    this.openRoomPage(roomid)
  }
  createRoom(): void {
    // Get the token from sessionStorage
    const token = sessionStorage.getItem('token');
    const room = this.createRoomForm.value;
    if (!token) {
      console.error('No token found in sessionStorage');
      alert('You must be logged in to add a Room.');
      return;
    }

    // Set headers with the Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Adding token to header
      'Content-Type': 'application/json'  // Set content type if necessary
    });

    // Construct the full URL dynamically using userId and skillId
    const fullUrl = `${this.apiUrl}`;

    // Make the POST request
    this.http.post(fullUrl, room, { headers, responseType: 'text' }).subscribe({
      next: (response) => {

        console.log('Room added response:', response);  // Log the response (which is plain text)
        alert(response);  // Notify user (you can replace this with any other handling)
        window.location.reload();
      },
      error: (error) => {
        console.error('API error:', error);
        if (error.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert('Error adding Room. Please try again.');
        }
      }
    });
  }
  async openCreateDialog() {

    this.dialog.open(this.Create)


  }

  async openRoomPage(roomId: number) {
    this.router.navigate(['/room-page', roomId]);
  }

}
