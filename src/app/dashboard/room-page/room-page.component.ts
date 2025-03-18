import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";

@Component({
  selector: "app-room-page",
  templateUrl: "./room-page.component.html",
  styleUrl: "./room-page.component.css",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
})
export class RoomPageComponent {
  // Component logic here
}
