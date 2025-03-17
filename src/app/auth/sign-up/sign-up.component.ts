import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      terms: [false, [Validators.requiredTrue]],
      firstName: ["Mohammad", [Validators.required]],
      lastName: ["Ahmad", [Validators.required]],
      dateOfBirth: ["12.05.1992", [Validators.required]],
      country: ["Jordan", [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log("Form submitted:", this.signUpForm.value);
      // Here you would typically send the data to your backend
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.signUpForm.controls).forEach((field) => {
        const control = this.signUpForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onClose() {
    // Handle close action
    console.log("Form closed");
  }
}
