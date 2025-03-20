import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ApiService } from "../../services/api.service";
import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from "@angular/material/icon";

interface Experience {
  id: number,
  name: string
}
interface Role {
  id: number,
  name: string
}
@Component({
  selector: "app-main",
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatIconModule
  ],
  providers: [ApiService, HttpClient],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent implements OnInit {
  @ViewChild('CreateInvite') Create: any
  createInviteForm!: FormGroup;
  allDevelopers: any = [];
  searchQuery: string = "";
  selectedRoles: string[] = [];
  allskills: any[] | undefined;
  selectedskill: number | undefined;
  allExperienceLevel: Experience[] = [];
  selectedLevel: number | undefined;
  allRoles: Role[] = [];
  selectedRole: number | undefined;
  filteredDevelopers: any[] = []; // Filtered developers based on selected skill
  allRooms: any = [];
  filteredRooms: any[] = [];
  userId: any;
  roomId: any;



  trackByFn(index: number, developer: any): string {
    return developer?.id || index.toString();
  }
  private apiUrl = "http://hackathon-ramadan.runasp.net/api"; // Base URL
  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router, public dialog: MatDialog
  ) {
    const nameIdentifierString = sessionStorage.getItem('nameidentifier');
    const userId = nameIdentifierString ? Number(nameIdentifierString) : null;

    this.createInviteForm = this.fb.group({
      inviterId: new FormControl(userId, [Validators.required]),
      inviteeId: new FormControl('', [Validators.required]),
      roomId: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    const nameIdentifierString = sessionStorage.getItem('nameidentifier');
    console.log("Retrieved userId from sessionStorage:", nameIdentifierString);

    const userId: number = nameIdentifierString ? Number(nameIdentifierString) : 0;

    console.log("Parsed userId:", userId);

    this.allExperienceLevel?.push({ id: 5, name: "Junior" })
    this.allExperienceLevel?.push({ id: 2, name: "Senior" })
    this.allRoles.push({ id: 3, name: "FrontEnd" })
    this.allRoles.push({ id: 4, name: "Backend" })
    this.getAllDevelopers().subscribe(
      (response: any) => {
        this.allDevelopers = response.data;
        this.filteredDevelopers = [...this.allDevelopers]; // Initially display all developers
      },
      (error) => {
        console.error("Error fetching developers:", error);
      }
    );
    this.getAllSkills().subscribe(
      (response: any) => {
        console.log(response); // Log response to check structure

        this.allskills = response.data.map((skill: { name: any; id: any; }) => ({
          name: skill.name, // Displayed in dropdown
          id: skill.id // Stored in selected value
        }));
      },
      (error) => {
        console.error("Error fetching skills:", error);
      }
    );
    this.FilterRoomsUser(userId);
  }

  getAllDevelopers(): Observable<any[]> {
    return this.http.get<any[]>(
      "http://hackathon-ramadan.runasp.net/api/Users/GetAll",
    );
  }
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(
      "http://hackathon-ramadan.runasp.net/api/Skills/GetAll",
    );
  }
  getUserInfo(skillId: number) {
    this.http.get<any>(`http://hackathon-ramadan.runasp.net/api/Skills/GetSkilledUsers/${skillId}`).subscribe(
      (response: any) => {
        console.log(response); // Log the entire response to see the structure
        this.filteredDevelopers = response.data; // Access the 'data' array from the response
        this.cdRef.detectChanges();
        console.log(this.allDevelopers); // Log the developers array to verify
      },
      (error) => {
        console.error("Error fetching developers:", error);

      },
    );
  }

  AllSelectedChange(skillId: number | null) {
    if (skillId) {
      this.getUserInfo(skillId);
    }
  }
  onDropdownChange() {
    if (this.selectedskill) {
      this.AllSelectedChange(this.selectedskill);
    }
  }
  getAllRooms(): Observable<any[]> {
    return this.http.get<any[]>(
      "http://hackathon-ramadan.runasp.net/api/Rooms/GetAll",

    );

  }
  FilterRoomsUser(userId: number) {
    this.getAllRooms().subscribe(
      (response: any) => {
        console.log('API Response:', response);

        // Extract the 'data' array from the response
        const rooms = response.data ?? []; // Ensures it's an array, avoids undefined errors

        if (Array.isArray(rooms)) {
          this.filteredRooms = rooms.filter(room => userId === room.creatorId);
          console.log('Filtered Rooms:', this.filteredRooms);
        } else {
          console.error("Expected an array but got:", rooms);
        }

        this.cdRef.detectChanges();
      },
      (error) => {
        console.error("Error fetching rooms:", error);
      }
    );
  }
  sendRoomId(roomId: any): any {
    this.roomId = roomId;
  }
  createInvite(inviteeId: any) {
    // Update the form with the inviteeId, roomId, and status
    this.dialog.open(this.Create);
    this.createInviteForm.patchValue({
      inviteeId: inviteeId,
      roomId: this.roomId,  // Assuming you have roomId available
      status: "Pending"
    });

    // Prepare the POST request body (form data)
    const inviteData = this.createInviteForm.value;

    // Set the token in the headers (replace with actual token)
    const token = sessionStorage.getItem('token'); // Replace with actual token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // or another appropriate content type
    });

    // Send the POST request to the specified URL
    const url = 'http://hackathon-ramadan.runasp.net/api/Invitations/Create';

    this.http.post(url, inviteData, { headers })
      .subscribe(
        (response) => {
          console.log('Invitation created successfully:', response);
          // Handle success response, e.g., show a success message or redirect
        },
        (error) => {
          console.error('Error creating invitation:', error);
          // Handle error response, e.g., show an error message
        }
      );
  }


}
