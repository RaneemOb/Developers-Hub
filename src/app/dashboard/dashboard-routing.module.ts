import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RoomPageComponent } from './room-page/room-page.component';
import { OpenSourceSuggestionPageComponent } from './open-source-suggestion-page/open-source-suggestion-page.component';
import { AllRoomsComponent } from './all-rooms/all-rooms.component';

const routes: Routes = [
  { path: "dashboard-main", component: MainComponent },
  { path: "room-page", component: RoomPageComponent },
  { path: "open-source-suggestion", component: OpenSourceSuggestionPageComponent },
  { path: "all-rooms", component: AllRoomsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
