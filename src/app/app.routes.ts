import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { MainComponent } from './dashboard/main/main.component';
import { RoomPageComponent } from './dashboard/room-page/room-page.component';
import { OpenSourceSuggestionPageComponent } from './dashboard/open-source-suggestion-page/open-source-suggestion-page.component';

export const routes: Routes = [
    { path: 'home-page', component: HomeComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: "dashboard-main", component: MainComponent },
    { path: "room-page", component: RoomPageComponent },
    { path: "open-source-suggestion", component: OpenSourceSuggestionPageComponent }
];
