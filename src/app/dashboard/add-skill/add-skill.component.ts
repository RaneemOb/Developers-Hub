import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
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
@Component({
  selector: 'app-add-skill',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-skill.component.html',
  styleUrl: './add-skill.component.css'
})
export class AddSkillComponent implements OnInit {
  allskills: any[] | undefined;
  selectedskill?: number;
  private apiUrl = 'http://hackathon-ramadan.runasp.net/api/Skills/AddUserSkill';
  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdRef: ChangeDetectorRef, private router: Router) { }
  ngOnInit(): void {
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
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(
      "http://hackathon-ramadan.runasp.net/api/Skills/GetAll",
    );
  }

  postSkillData(userId: number, skillId: number): void {
    // Get the token from sessionStorage
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('No token found in sessionStorage');
      alert('You must be logged in to add a skill.');
      return;
    }

    // Set headers with the Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Adding token to header
      'Content-Type': 'application/json'  // Set content type if necessary
    });

    // Construct the full URL dynamically using userId and skillId
    const fullUrl = `${this.apiUrl}/${userId}/${skillId}`;

    // Make the POST request
    this.http.post(fullUrl, {}, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Skill added response:', response);  // Log the response (which is plain text)
        alert(response);  // Notify user (you can replace this with any other handling)
        this.router.navigate(['/dashboard-main']);
      },
      error: (error) => {
        console.error('API error:', error);
        if (error.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert('Error adding skill. Please try again.');
        }
      }
    });
  }


  // Method to be called from your component
  AllSelectedChange(): void {
    const nameIdentifierString = sessionStorage.getItem('nameidentifier');

    // Convert it to a number
    const userId = nameIdentifierString ? Number(nameIdentifierString) : null; // Assuming userId is stored in sessionStorage or can be decoded from JWT token
    if (userId && this.selectedskill) {
      this.postSkillData(userId, this.selectedskill); // Call the post method to send data
    } else {
      console.error('User ID or Skill ID is missing');
    }
  }


}
