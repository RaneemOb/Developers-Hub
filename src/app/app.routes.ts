import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { MainComponent } from './dashboard/main/main.component';
import { RoomPageComponent } from './dashboard/room-page/room-page.component';
import { OpenSourceSuggestionPageComponent } from './dashboard/open-source-suggestion-page/open-source-suggestion-page.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { AllRoomsComponent } from './dashboard/all-rooms/all-rooms.component';
import { MyInvitationsComponent } from './dashboard/my-invitations/my-invitations.component';
import { AddSkillComponent } from './dashboard/add-skill/add-skill.component';

export const routes: Routes = [
    { path: 'home-page', component: HomeComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: "dashboard-main", component: MainComponent },
    { path: "room-page/:roomId", component: RoomPageComponent },
    { path: "open-source-suggestion", component: OpenSourceSuggestionPageComponent },
    { path: "all-rooms", component: AllRoomsComponent },
    { path: "my-invitations", component: MyInvitationsComponent },
    { path: "add-skill", component: AddSkillComponent },

    { path: "", component: HomeComponent },
    { path: "**", component: HomeComponent }
];
