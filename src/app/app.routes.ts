import { Routes } from '@angular/router';
import { SeriesListComponent } from './pages/series-list/series-list.component';
import { SeriesDetailComponent } from './pages/series-detail/series-detail.component';

export const routes: Routes = [
  { path: '', component: SeriesListComponent, pathMatch: 'full' },
  { path: 'series/:id', component: SeriesDetailComponent },
  { path: '**', redirectTo: '' }
];
