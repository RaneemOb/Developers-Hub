import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.css",
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  userId: any;
  private skillsUrl = 'https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Skills/GetUserSkills/';
  private loginUrl = 'https://api.allorigins.win/raw?url=http://hackathon-ramadan.runasp.net/api/Auth/LoginUserByEmailAndPassword';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  getUserSkillsCount(userId: number): Observable<number> {
    return new Observable<number>((observer) => {
      this.http.get<any>(`${this.skillsUrl}${userId}`).subscribe({
        next: (response: { data: string | any[]; }) => {
          // If API returns data
          if (response && response.data) {
            // Return the number of skills in the 'data' array
            observer.next(response.data.length);
          } else {
            observer.next(0);  // If no data found, return 0
          }
        },
        error: (err: any) => {
          console.error('Error fetching user skills:', err);
          observer.error(err); // Handle API error
        }
      });
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;


      this.http.post<any>(this.loginUrl, credentials).subscribe({
        next: (response) => {

          const token = response.data; //token inside data

          if (token) {

            sessionStorage.setItem('token', token); // Store token
            console.log(token);

            const decodedToken: any = jwtDecode(token);

            // Access and store nameidentifier from the decoded token
            const nameIdentifier = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            sessionStorage.setItem('nameidentifier', nameIdentifier);


            this.getUserSkillsCount(nameIdentifier).subscribe({
              next: (skillCount) => {
                if (skillCount !== 0) {
                  // Redirect to the dashboard if the user has skills
                  this.router.navigate(['/dashboard-main']);
                } else {
                  // Redirect to the add skill page if no skills are found
                  this.router.navigate(['/add-skill']);
                }
              },
              error: (err) => {
                console.error('Error fetching skills:', err);
                alert('Error retrieving skills');
              },
            });
          } else {
            console.error('Token is missing in the response');
            alert('Error: Token is missing');
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid email or password');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get formControls() {
    return this.loginForm.controls;
  }



  navigateToRegister(): void {
    this.router.navigate(["sign-up"]);
  }
}
