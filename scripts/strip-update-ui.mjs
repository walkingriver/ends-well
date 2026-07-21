import { writeFileSync } from 'node:fs';

const appComponent = `import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: \`
    <mat-toolbar color="primary">
      <a routerLink="/" class="brand" aria-label="Go to home page">
        <mat-icon>movie</mat-icon>
        Ends Well
      </a>
      <span class="spacer"></span>
      <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Browse</a>
    </mat-toolbar>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  \`,
  styles: \`
    :host {
      display: block;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .brand {
      text-decoration: none;
      color: inherit;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .active {
      background: rgba(255, 255, 255, 0.15);
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  \`,
})
export class AppComponent {}
`;

writeFileSync('src/app/app.component.ts', appComponent);
