import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ApiService } from "../../services/api.service";
import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { ChangeDetectorRef } from '@angular/core';
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
  imports: [CommonModule, FormsModule, HttpClientModule, SidebarComponent],
  providers: [ApiService, HttpClient],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent implements OnInit {
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






  trackByFn(index: number, developer: any): string {
    return developer?.id || index.toString();
  }
  private apiUrl = "http://hackathon-ramadan.runasp.net/api"; // Base URL
  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
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



}
