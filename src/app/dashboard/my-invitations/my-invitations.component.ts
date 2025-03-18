import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";

interface Invitation {
  id: number;
  roomName: string;
  invitedBy: string;
  time: string;
  avatarUrl?: string;
}

@Component({
  selector: "app-my-invitations",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./my-invitations.component.html",
  styleUrl: "./my-invitations.component.css",
})
export class MyInvitationsComponent {
  invitations: Invitation[] = [
    {
      id: 1,
      roomName: "Room1",
      invitedBy: "Ahmad..",
      time: "12:00 PM",
    },
    {
      id: 2,
      roomName: "Room1",
      invitedBy: "...",
      time: "12:00 PM",
    },
  ];

  userName: string = "Mohammad Ahmad";

  acceptInvitation(invitationId: number): void {
    console.log(`Accepting invitation ${invitationId}`);
    // Here you would implement the logic to accept an invitation
    // For example, calling a service method
  }

  rejectInvitation(invitationId: number): void {
    console.log(`Rejecting invitation ${invitationId}`);
    // Here you would implement the logic to reject an invitation
    // For example, calling a service method
  }
}
