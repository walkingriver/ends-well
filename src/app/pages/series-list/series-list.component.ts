import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SeriesCardComponent } from '../../shared/components/series-card/series-card.component';
import { SeriesService } from '../../services/series';

interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-series-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SeriesCardComponent,
  ],
  templateUrl: './series-list.component.html',
  styleUrl: './series-list.component.scss',
})
export class SeriesListComponent {
  readonly seriesService = inject(SeriesService);

  searchQuery = signal('');
  currentSort = signal('rating_desc');
  pageIndex = signal(0);
  pageSize = signal(6);

  sortOptions: SortOption[] = [
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'title_asc', label: 'Title A–Z' },
    { value: 'title_desc', label: 'Title Z–A' },
    { value: 'year_desc', label: 'Newest First' },
    { value: 'year_asc', label: 'Oldest First' },
  ];

  filteredSeries = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const source = this.seriesService.seriesList();

    if (!query) {
      return source;
    }

    return source.filter(
      (series) =>
        series.title.toLowerCase().includes(query) ||
        series.genres.some((genre) => genre.toLowerCase().includes(query)),
    );
  });

  sortedSeries = computed(() => {
    const list = [...this.filteredSeries()];
    switch (this.currentSort()) {
      case 'title_asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'year_desc':
        return list.sort((a, b) => b.yearStarted - a.yearStarted);
      case 'year_asc':
        return list.sort((a, b) => a.yearStarted - b.yearStarted);
      case 'rating_desc':
      default:
        return list.sort((a, b) => b.averageRating - a.averageRating);
    }
  });

  paginatedSeries = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.sortedSeries().slice(start, start + this.pageSize());
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.pageIndex.set(0);
  }

  onSortChange(value: string): void {
    this.currentSort.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
