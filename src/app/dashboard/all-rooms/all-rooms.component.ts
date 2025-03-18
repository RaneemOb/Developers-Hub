import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";

interface Room {
  id: number;
  name: string;
  description: string;
  time: string;
  avatar?: string;
}

@Component({
  selector: "app-all-rooms",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: "./all-rooms.component.html",
  styleUrl: "./all-rooms.component.css",
})
export class AllRoomsComponent {
  createdRooms: Room[] = [
    {
      id: 1,
      name: "Room1",
      description: "Something short and simple here.😊",
      time: "12:00 PM",
    },
    {
      id: 2,
      name: "Room1",
      description: "Something short and simple here.😊",
      time: "12:00 PM",
    },
  ];

  memberRooms: Room[] = [
    {
      id: 3,
      name: "Room1",
      description: "Something short and simple here.😊",
      time: "12:00 PM",
    },
    {
      id: 4,
      name: "Room1",
      description: "Something short and simple here.😊",
      time: "12:00 PM",
    },
  ];

  constructor() {}
}
