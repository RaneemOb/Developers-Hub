import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent {
  @Input() activeItem: string = "discover";

  constructor(private router: Router) { }
  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/sign-in']);

  }

}
