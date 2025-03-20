import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { HttpClient } from "@angular/common/http";

interface BotMessage {
  label: string;
  content: string;
}

@Component({
  selector: "app-open-source-suggestion-page",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./open-source-suggestion-page.component.html",
  styleUrl: "./open-source-suggestion-page.component.css",
})
export class OpenSourceSuggestionPageComponent {
  username: string = "Mohammad Ahmad";
  suggestions: string = '';
  botMessages: BotMessage[] = [
    { label: "Bot Message", content: "Open source project in Github" },
    { label: "Bot Message", content: "build in : C# , Angular ...." },
    { label: "Bot Message", content: "Project URL" },
    { label: "Bot Message", content: "Project overview" },
  ];

  suggestOpenSourceProjects() {
    // fill the userId correctly
    this.getSuggestion(1).subscribe(
      (response) => {
        console.log(response);
        this.suggestions = response;
      },
      (error) => {
        console.error("Error fetching suggestions:", error);
      }
    );
// this for test delete it after test

//     this.suggestions = `<!DOCTYPE html>
// <html>
// <head>
// <title>Open Source Project Recommendations</title>
// </head>
// <body>

// <h2>Open Source Project Recommendations for a Beginner Web Developer</h2>

// <p>Based on your profile (Beginner, Web Development, string1, 2-4 hours/week), here are some suitable open-source projects:</p>

// <ul>

//   <li>
//     <h3>Project: First Contributions</h3>
//     <p><b>Description:</b> A project designed to help beginners make their first open source contribution.  It provides a straightforward process to contribute to a GitHub repository.</p>
//     <p><b>GitHub Repository:</b> <a href="https://github.com/firstcontributions/first-contributions">https://github.com/firstcontributions/first-contributions</a></p>
//     <p><b>Difficulty Level:</b> Very Easy</p>
//     <p><b>Getting Started:</b> Follow the instructions in the README.md file.  Focus on adding your name to the Contributors.md file.  This involves learning the basics of Git and GitHub pull requests.</p>
//   </li>

//   <li>
//     <h3>Project: Exercism</h3>
//     <p><b>Description:</b> A platform offering coding exercises in various languages, including string1.  Many tracks have open-source components related to problem definitions, tests, and documentation.</p>
//     <p><b>GitHub Repository:</b> <a href="https://github.com/exercism/exercism">https://github.com/exercism/exercism</a></p>
//     <p><b>Difficulty Level:</b> Easy to Medium (depending on the task)</p>
//     <p><b>Getting Started:</b>  Visit the Exercism website and choose the string1 track. Look for issues labeled "good first issue" or "help wanted" in the project's GitHub repository. Consider improving documentation or adding tests.</p>
//   </li>

//    <li>
//     <h3>Project: Hacktoberfest (during October)</h3>
//     <p><b>Description:</b> During October, many beginner-friendly projects get tagged with "hacktoberfest". Look for projects tagged "hacktoberfest" and "good first issue". Focus on small documentation or frontend changes.</p>
//     <p><b>GitHub Search:</b> <a href="https://github.com/search?q=label%3Ahacktoberfest+label%3A%22good+first+issue%22&type=issues">GitHub Issue Search</a></p>
//     <p><b>Difficulty Level:</b> Very Easy to Easy</p>
//     <p><b>Getting Started:</b> Use the provided GitHub search link in October. Read the project's README.md and CONTRIBUTING.md files.  Focus on projects with clear instructions and small, well-defined tasks.</p>
//   </li>

//   <li>
//     <h3>Project: Static Site Generators (e.g., Jekyll, Hugo, Gatsby)</h3>
//     <p><b>Description:</b> Many websites use static site generators. Often, there are opportunities to contribute to the themes or documentation of these projects. String1 might be relevant for theme development.</p>
//     <p><b>Example (Jekyll):</b> <a href="https://github.com/jekyll/jekyll">https://github.com/jekyll/jekyll</a></p>
//     <p><b>Difficulty Level:</b> Easy to Medium (depending on the task)</p>
//     <p><b>Getting Started:</b>  Choose a static site generator you're interested in.  Explore their documentation and look for ways to improve it. Consider contributing to a theme by fixing bugs or adding new features. Find projects that use the string1 language.</p>
//   </li>
// </ul>

// <p><b>Important Tips for Beginners:</b></p>
// <ul>
//   <li><b>Read the project's README and CONTRIBUTING guides.</b> These documents provide essential information about the project's goals, code style, and contribution process.</li>
//   <li><b>Start with small, well-defined tasks.</b>  Don't try to tackle complex features right away.</li>
//   <li><b>Communicate with the project maintainers.</b> Ask questions if you're unsure about something.</li>
//   <li><b>Be patient and persistent.</b> Open source contributions can be challenging, but they're also incredibly rewarding.</li>
//   <li><b>Consider looking for projects related to string1 on GitHub using search terms like "string1" "web development" "beginner friendly".</b></li>
// </ul>

// </body>
// </html>`;
  }

  constructor(private http: HttpClient) {}

  private getSuggestion(userId: number) {
    return this.http.get<any>(
      `http://hackathon-ramadan.runasp.net/api/AiIntegration/${userId}/SuggestOpenSourceProjects`
    );
  }
}
