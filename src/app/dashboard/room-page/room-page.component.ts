import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Member {
  name: string;
  role: string;
  avatarColor?: string;
}

interface Message {
  sender: string;
  content: string | string[];
  isMultiline?: boolean;
}

@Component({
  selector: "app-room-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./room-page.component.html",
  styleUrl: "./room-page.component.css",
})
export class RoomPageComponent {
  roomName: string = "Room Name";
  username: string = "Mohammad Ahmad";

  messages: Message[] = [
    {
      sender: "Bot Message",
      content: "Based in you Experience",
    },
    {
      sender: "Bot Message",
      content: "you can build E-commerce",
    },
    {
      sender: "Bot Message",
      content: ["Each one role :", "", "Sami : Front-end", "", "Moh:Back-end"],
      isMultiline: true,
    },
    {
      sender: "Bot Message",
      content: "Project overview",
    },
  ];

  members: Member[] = [
    {
      name: "Saleh Ahmad",
      role: "IDR 45.000",
    },
    {
      name: "Safwan Moh",
      role: "IDR 75.000",
    },
  ];

  suggestProject(): void {
    // Implementation for suggesting a project
    console.log("Suggesting project for room");
  }

  suggestWorkPlan(): void {
    // Implementation for suggesting a work plan
    console.log("Suggesting work plan");
  }
}
