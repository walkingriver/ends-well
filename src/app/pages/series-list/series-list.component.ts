import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SeriesCardComponent, FeaturedSeries } from '../../shared/components/series-card/series-card.component';

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
    SeriesCardComponent,
  ],
  templateUrl: './series-list.component.html',
  styleUrl: './series-list.component.scss',
})
export class SeriesListComponent {
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

  allSeries: FeaturedSeries[] = [
    {
      id: '1',
      title: 'Breaking Bad',
      yearStarted: 2008,
      yearEnded: 2013,
      averageRating: 9.5,
      posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      genres: ['Drama', 'Crime', 'Thriller'],
    },
    {
      id: '2',
      title: 'The Good Place',
      yearStarted: 2016,
      yearEnded: 2020,
      averageRating: 8.2,
      posterPath: '/assets/images/poster-placeholder.jpg',
      genres: ['Comedy', 'Drama', 'Fantasy'],
    },
    {
      id: '3',
      title: 'The Office',
      yearStarted: 2005,
      yearEnded: 2013,
      averageRating: 8.9,
      posterPath: 'https://www.themoviedb.org/t/p/w1280/dg9e5fPRRId8PoBE0F6jl5y85Eu.jpg',
      genres: ['Comedy', 'Mockumentary'],
    },
    {
      id: '4',
      title: 'Game of Thrones',
      yearStarted: 2011,
      yearEnded: 2019,
      averageRating: 9.3,
      posterPath: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      genres: ['Fantasy', 'Drama', 'Adventure'],
    },
    {
      id: '5',
      title: 'Six Feet Under',
      yearStarted: 2001,
      yearEnded: 2005,
      averageRating: 8.7,
      posterPath: '/assets/images/poster-placeholder.jpg',
      genres: ['Drama', 'Comedy'],
    },
    {
      id: '6',
      title: 'The Americans',
      yearStarted: 2013,
      yearEnded: 2018,
      averageRating: 8.4,
      posterPath: '/assets/images/poster-placeholder.jpg',
      genres: ['Drama', 'Thriller', 'Crime'],
    },
  ];

  filteredSeries = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.allSeries;
    }
    return this.allSeries.filter(
      (series) =>
        series.title.toLowerCase().includes(query) ||
        series.genres?.some((genre) => genre.toLowerCase().includes(query)),
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
