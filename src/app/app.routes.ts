import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SeriesListComponent } from './pages/series-list/series-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'series', component: SeriesListComponent },
];
