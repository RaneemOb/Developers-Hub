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
import { Observable, switchMap, of } from "rxjs";

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

  combinedInfo?: any[];
  combinedInfoWithInvitations?: any[];
  invitationDetails: any;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog, private route: ActivatedRoute) { }
  ngOnInit(): void {
    const nameIdentifierString = sessionStorage.getItem('nameidentifier');
    this.userId = nameIdentifierString ? Number(nameIdentifierString) : null;
    this.getAllInvitations();
    this.filterInvitations();
    this.fetchRoomDetails();
    this.fetchInfoById();
    this.combineRoomsAndUsers();


  }

  getRoomById(roomId: number) {
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
      `http://hackathon-ramadan.runasp.net/api/Rooms/GetById/${roomId}`,
      { headers }
    );
  }
  fetchRoomDetails(): void {
    this.filteredInvitations?.forEach((invitation) => {
      this.getRoomById(invitation.roomId).subscribe(
        (roomResponse: any) => {
          if (roomResponse && roomResponse.data) {
            const room = {
              id: roomResponse.data.id,
              name: roomResponse.data.name,
              description: roomResponse.data.description,
              createdAt: roomResponse.data.createdAt,
              creatorId: roomResponse.data.creatorId

            };
            this.roomsInfo?.push(room); // Add room details to roomsInfo array
          } else {
            console.error('Unexpected room details structure:', roomResponse);
          }
        },
        (error) => {
          console.error(`Error fetching room details for roomId ${invitation.RoomId}:`, error);
        }
      );
    });
  }
  fetchInfoById() {
    this.roomsInfo?.forEach((room) => {
      this.getUserById(room.creatorId).subscribe(
        (response: any) => {
          if (response && response.data) {
            const user = {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              bio: response.data.bio,


            };
            this.usersInfo?.push(room); // Add room details to roomsInfo array
          } else {
            console.error('Unexpected user details structure:', response);
          }
        },
        (error) => {
          console.error(`Error fetching user details for roomId ${room.creatorId}:`, error);
        }
      );
    });
  }
  getUserById(creatorId: any) {
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
      `http://hackathon-ramadan.runasp.net/api/Users/GetById/${creatorId}`,
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

    this.http.get<any[]>(`http://hackathon-ramadan.runasp.net/api/Invitations/GetAll`, { headers })
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
  combineRoomsAndUsers(): void {
    this.combinedInfo = this.roomsInfo?.map(room => {
      // Find the corresponding user based on the creatorId (room.creatorId)
      const user = this.usersInfo?.find(user => user.id === room.creatorId);

      // Combine the room and user properties into one object
      if (user) {
        return {
          ...room,  // Spread room properties
          creatorName: user.name,  // Add the user's name as creatorName
          creatorEmail: user.email,  // Add the user's email as creatorEmail
          creatorBio: user.bio,  // Add the user's bio as creatorBio
        };
      }
      return room;  // Return room as-is if no corresponding user is found
    });

    console.log(this.combinedInfo); // Log the combined list for debugging
  }
  combineRoomsUsersAndInvitations(): void {
    this.combinedInfoWithInvitations = this.combinedInfo?.map(room => {
      // Find the corresponding invitation based on the roomId
      const invitation = this.filteredInvitations?.find(invite => invite.roomId === room.id);

      // Combine the room, user, and invitation properties into one object
      if (invitation) {
        return {
          ...room,  // Spread room properties
          creatorName: room.creatorName,  // User's name from combinedInfo
          creatorEmail: room.creatorEmail,  // User's email from combinedInfo
          creatorBio: room.creatorBio,  // User's bio from combinedInfo
          invitationStatus: invitation.status,  // Invitation status
          invitationCreatedAt: invitation.createdAt,  // Invitation created date
          invitationUpdatedAt: invitation.updatedAt,// Invitation updated date
          invitationId: invitation.id
        };
      }
      return room;  // Return room as-is if no corresponding invitation is found
    });

    console.log(this.combinedInfoWithInvitations); // Log the combined list for debugging
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
    const url = `http://hackathon-ramadan.runasp.net/api/Invitations/Update/${invitationId}`;
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
    const url = `http://hackathon-ramadan.runasp.net/api/Invitations/GetById/${id}`;
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
