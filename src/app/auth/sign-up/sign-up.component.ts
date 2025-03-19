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
} from "@angular/common/http";
import { Router } from '@angular/router';
interface Experience {
  id: number,
  name: string
}
interface Role {
  id: number,
  name: string
}
@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent implements OnInit {
  allExperienceLevel: Experience[] = [];
  selectedLevel: number | undefined;
  allRoles: Role[] = [];
  selectedRole: number | undefined;
  allskills: any[] | undefined;
  selectedskill: number | undefined;
  signUpForm: FormGroup;
  name: any;
  email: any;
  passwordHash: any;
  bio: any;
  userId: any;
  responseData: Object | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdRef: ChangeDetectorRef, private router: Router) {
    this.signUpForm = this.fb.group({
      name: [[Validators.required]],
      email: [[Validators.required]],
      passwordHash: [[Validators.required]],
      bio: [[Validators.required]],
    });

  }

  ngOnInit(): void {
    this.allExperienceLevel?.push({ id: 5, name: "Junior" })
    this.allExperienceLevel?.push({ id: 2, name: "Senior" })
    this.allRoles.push({ id: 3, name: "FrontEnd" })
    this.allRoles.push({ id: 4, name: "Backend" })
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
  onDropdownChange() {
    if (this.selectedskill) {
      this.AllSelectedChange(this.selectedskill);
    }
  }
  AllSelectedChange(skillId: number | null) {
    if (skillId) {
      //call post methods(add skill , add level,add role)
    }
  }
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(
      "http://hackathon-ramadan.runasp.net/api/Skills/GetAll",
    );
  }


  onSubmit() {
    if (this.signUpForm.valid) {
      // Get the form values and send them as a POST request
      const postData = this.signUpForm.value;  // This extracts the data from the form group

      this.http.post('http://hackathon-ramadan.runasp.net/api/Users/Create', postData)
        .subscribe(
          (response) => {
            this.responseData = response;
            console.log('Response:', response);
            this.router.navigate(['/sign-in']);
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

  onClose() {
    // Handle close action
    console.log("Form closed");
  }
}
