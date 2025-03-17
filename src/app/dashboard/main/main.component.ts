import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-main",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent {
  // This component could be expanded with additional functionality as needed
  // For example:
  // - Methods to handle search functionality
  // - Methods to handle filter selections
  // - Methods to handle invitations and rooms
}
