import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-room-page",
  templateUrl: "./room-page.component.html",
  styleUrl: "./room-page.component.css",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
})
export class RoomPageComponent {

  suggestions: string = '';

  constructor(private http: HttpClient) {}

  suggestProjectForRoom() {
    // fill the roomId correctly
    this.getRoomSuggestion(1).subscribe(
      (response) => {
        console.log(response);
        this.suggestions = response;
      },
      (error) => {
        console.error("Error fetching suggestions:", error);
      }
    );
  }
  private getRoomSuggestion(roomId: number) {
    return this.http.get<any>(
      `http://hackathon-ramadan.runasp.net/api/AiIntegration/${roomId}/SuggestRoomProject`
    );
  }
}
