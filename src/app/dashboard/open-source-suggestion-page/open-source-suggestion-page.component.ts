import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface BotMessage {
  label: string;
  content: string;
}

@Component({
  selector: "app-open-source-suggestion-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./open-source-suggestion-page.component.html",
  styleUrl: "./open-source-suggestion-page.component.css",
})
export class OpenSourceSuggestionPageComponent {
  username: string = "Mohammad Ahmad";

  botMessages: BotMessage[] = [
    { label: "Bot Message", content: "Open source project in Github" },
    { label: "Bot Message", content: "build in : C# , Angular ...." },
    { label: "Bot Message", content: "Project URL" },
    { label: "Bot Message", content: "Project overview" },
  ];

  constructor() {}
}
