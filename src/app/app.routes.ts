import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SeriesListComponent } from './pages/series-list/series-list.component';
import { SeriesDetailComponent } from './pages/series-detail/series-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'series', component: SeriesListComponent },
  { path: 'series/:id', component: SeriesDetailComponent },
];
