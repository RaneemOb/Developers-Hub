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
import { Observable, switchMap, of, forkJoin, map, catchError } from "rxjs";

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
  selector: "app-my-invitations",
  standalone: true,
  imports: [MatCardModule, CommonModule, ReactiveFormsModule, SidebarComponent, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./my-invitations.component.html",
  styleUrl: "./my-invitations.component.css",
})
export class MyInvitationsComponent implements OnInit {
  allInvitations?: any[] = [];
  filteredInvitations?: any[] = []; // Initialize an array to hold filtered invitations
  userId: any;
  roomsInfo?: any[] = [];
  usersInfo?: any[] = [];
  roomName: any;
  userName: any;
  combinedInfo?: any[];
  combinedInfoWithInvitations?: any[];
  invitationDetails: any;
  private roomCache: { [key: number]: string } = {};
  private userCach: { [key: number]: string } = {};
  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog, private route: ActivatedRoute) { }
  ngOnInit(): void {
    const nameIdentifierString = sessionStorage.getItem('nameidentifier');
    this.userId = nameIdentifierString ? Number(nameIdentifierString) : null;
    this.getAllInvitations();
    this.filterInvitations();
    //this.fetchRoomDetails();
    // this.fetchInfoById();
    //this.combineRoomsAndUsers();
    // this.combineRoomsUsersAndInvitations();


  }

  getRoomById(roomId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return of({});  // Return an empty object if no token is found
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
  getRoomName(roomId: number): Observable<string> {
    // Check if room name is already cached
    if (this.roomCache[roomId]) {
      return of(this.roomCache[roomId]);
    }

    return this.getRoomById(roomId).pipe(
      map(response => {
        const roomName = response?.data?.name || 'Unknown Room';
        this.roomCache[roomId] = roomName;  // Cache the room name
        return roomName;
      }),
      catchError(err => {
        console.error('Error fetching room:', err);
        return of('Error fetching room');
      })
    );
  }






  getUserName(invitorId: any): Observable<string> {
    // Check if room name is already cached
    if (this.userCach[invitorId]) {
      return of(this.userCach[invitorId]);
    }

    return this.getUserById(invitorId).pipe(
      map(response => {
        const userName = response?.data?.name || 'Unknown User';
        this.userCach[invitorId] = userName;  // Cache the room name
        return userName;
      }),
      catchError(err => {
        console.error('Error fetching room:', err);
        return of('Error fetching room');
      })
    );
  }


  getUserById(creatorId: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return of({});  // Return an empty object if no token is found
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Users/GetById/${creatorId}`,
      { headers }
    );
  }
  filterInvitations(): void {
    this.filteredInvitations = this.allInvitations?.filter(
      invitation => invitation.status === 'Pending' && invitation.inviteeId === this.userId
    );
    console.log("recieved Invitations", this.filteredInvitations); // Log filtered invitations
  }
  getAllInvitations(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>(`https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Invitations/GetAll`, { headers })
      .subscribe(
        (response: any) => {
          if (response && response.data && response.data.length > 0) {
            // Extract and map the data
            this.allInvitations = response.data.map((invitation: any) => ({
              id: invitation.id,
              inviterId: invitation.inviterId,
              inviteeId: invitation.inviteeId,
              roomId: invitation.roomId,
              status: invitation.status || 'Pending',
              createdAt: invitation.createdAt,
              updatedAt: invitation.updatedAt
            }));

            // Now filter the invitations based on your specific criteria
            this.filterInvitations();

            console.log("Filtered Invitations:", this.filteredInvitations); // Debugging
          } else {
            console.error('No invitations found');
            this.allInvitations = []; // Ensure it's an empty array if no data is found
          }
        },
        (error) => {
          console.error('Error fetching invitations:', error);
        }
      );
  }







  acceptInvitation(invitationId: number): void {
    console.log(`Accepting invitation ${invitationId}`);
    this.getInvitationById(invitationId);
    this.updateInvitation(invitationId);
    window.location.reload();
  }
  updateInvitation(invitationId: number): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }
    const updatedInvitation = {
      ...this.invitationDetails, // Spread operator to keep other properties
      status: 'Accepted',
      updatedAt: new Date().toISOString() // Optional: Update timestamp
    };
    const url = `https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Invitations/Update/${invitationId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(url, updatedInvitation, { headers }).subscribe(
      (response) => {
        console.log('Invitation updated successfully:', response);
      },
      (error) => {
        console.error('Error updating invitation:', error);
      }
    );
  }
  getInvitationById(id: number): void {
    const url = `https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Invitations/GetById/${id}`;
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get(url, { headers }).subscribe(
      (data) => {
        this.invitationDetails = data;
        console.log('Invitation Details:', data);
      },
      (error) => {
        console.error('Error fetching invitation:', error);
      }
    );
  }
  rejectInvitation(invitationId: number): void {
    console.log(`Rejecting invitation ${invitationId}`);
    // Here you would implement the logic to reject an invitation
    // For example, calling a service method
  }
}
