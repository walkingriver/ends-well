import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SeriesService } from '../../services/series';
import { TvSeries } from '../../models/tv-series.model';

interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-series-list',
  imports: [
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="series-list-container">
      <!-- Search and Sort -->
      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search series...</mat-label>
          <input
            matInput
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search by title or genre"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="sort-field">
          <mat-label>Sort by</mat-label>
          <mat-select [value]="currentSort()" (selectionChange)="onSortChange($event.value)">
            @for (option of sortOptions; track option.value) {
              <mat-option [value]="option.value">
                {{ option.label }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading series...</p>
        </div>
      } @else {
        <!-- Series Grid -->
        <div class="series-grid">
          @for (series of paginatedSeries(); track series.id) {
            <mat-card class="series-card">
              <div
                class="card-image"
                [style.backgroundImage]="'url(' + series.posterPath + ')'"
              >
                <div class="card-rating">
                  <mat-icon>star</mat-icon>
                  <span>{{ series.averageRating }}</span>
                </div>
              </div>
              <mat-card-content>
                <h3 class="series-title">
                  <a [routerLink]="['/series', series.id]" class="title-link">{{ series.title }}</a>
                </h3>
                <div class="series-meta">
                  <span class="year">{{ series.yearStarted }}</span>
                  @if (series.seasons) {
                    <span class="seasons">{{ series.seasons }} seasons</span>
                  }
                </div>
                <div class="genres">
                  @for (genre of series.genres; track genre; let last = $last) {
                    <span class="genre">{{ genre }}{{ !last ? ' •' : '' }}</span>
                  }
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary" [routerLink]="['/series', series.id]">
                  View Details
                </button>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <div class="empty-state">
              <mat-icon>search_off</mat-icon>
              <p>No series found matching your search.</p>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (filteredSeries().length > 0) {
          <mat-paginator
            [length]="filteredSeries().length"
            [pageSize]="pageSize()"
            [pageIndex]="currentPage()"
            [pageSizeOptions]="[6, 12, 24]"
            (page)="onPageChange($event)"
            showFirstLastButtons
            aria-label="Select page"
          >
          </mat-paginator>
        }
      }
    </div>
  `,
  styles: `
    .series-list-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-container {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .sort-field {
      width: 200px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .series-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .series-card {
      display: flex;
      flex-direction: column;
    }

    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: #1a1a1a;
      position: relative;
    }

    .card-rating {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: #ffd700;
      padding: 4px 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    .card-rating mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
    }

    mat-card-content {
      padding-top: 16px;
    }

    .series-title {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .title-link {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: #3f51b5;
          text-decoration: underline;
        }
      }
    }

    .series-meta {
      display: flex;
      gap: 16px;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .genres {
      font-size: 0.85rem;
      color: #888;
    }

    .genre {
      margin-right: 4px;
    }

    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
  `,
})
export class SeriesListComponent implements OnInit, OnDestroy {
  private seriesService = inject(SeriesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Search and sort state
  searchQuery = '';
  currentSort = signal('rating_desc');

  sortOptions: SortOption[] = [
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'year_desc', label: 'Newest First' },
    { value: 'year_asc', label: 'Oldest First' },
  ];

  // Pagination state
  currentPage = signal(0);
  pageSize = signal(6);

  // Loading state
  isLoading = signal(false);

  // Search results (separate from base list)
  private searchResults = signal<TvSeries[] | null>(null);

  // Base series from the service
  private baseSeries = this.seriesService.seriesList;

  // Filtered and sorted series
  filteredSeries = computed(() => {
    // Use search results if available, otherwise use base series
    let result = this.searchResults() ?? [...this.baseSeries()];

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (this.currentSort()) {
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'rating_desc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'year_desc':
          return (b.yearStarted || 0) - (a.yearStarted || 0);
        case 'year_asc':
          return (a.yearStarted || 0) - (b.yearStarted || 0);
        default:
          return 0;
      }
    });

    return result;
  });

  // Paginated series for display
  paginatedSeries = computed(() => {
    const startIndex = this.currentPage() * this.pageSize();
    return this.filteredSeries().slice(startIndex, startIndex + this.pageSize());
  });

  ngOnInit(): void {
    // Read initial query params
    const initialQuery = this.route.snapshot.queryParamMap.get('q') || '';
    const initialSort = this.route.snapshot.queryParamMap.get('sort') || 'rating_desc';

    if (initialQuery) {
      this.searchQuery = initialQuery;
      this.performSearch(initialQuery);
    }
    if (initialSort) {
      this.currentSort.set(initialSort);
    }

    // Set up debounced search with URL sync
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.updateQueryParams();
        this.performSearch(query);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.searchSubject.next(this.searchQuery);
  }

  private updateQueryParams(): void {
    const queryParams: { q?: string; sort?: string } = {};

    if (this.searchQuery.trim()) {
      queryParams.q = this.searchQuery;
    }
    if (this.currentSort() !== 'rating_desc') {
      queryParams.sort = this.currentSort();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true, // Don't add to history for each keystroke
    });
  }

  private performSearch(query: string): void {
    if (!query.trim()) {
      // Clear search results, show base list
      this.searchResults.set(null);
      return;
    }

    this.isLoading.set(true);
    this.seriesService.searchSeries(query).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.isLoading.set(false);
      },
    });
  }

  onSortChange(value: string): void {
    this.currentSort.set(value);
    this.currentPage.set(0);
    this.updateQueryParams();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
