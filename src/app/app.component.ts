import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-update-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Update available</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Later</button>
      <button mat-button color="primary" [mat-dialog-close]="true">Update now</button>
    </mat-dialog-actions>
  `,
})
export class UpdateDialogComponent {
  readonly data = inject<{ message: string }>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" class="brand" aria-label="Go to home page">
        <mat-icon>movie</mat-icon>
        Ends Well
      </a>
      <span class="spacer"></span>
      <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Browse</a>
      @if (updatesEnabled) {
        <button mat-button type="button" (click)="checkForUpdate()">Check for updates</button>
      }
    </mat-toolbar>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
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
  `,
})
export class AppComponent implements OnInit {
  private readonly swUpdate = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly updatesEnabled = this.swUpdate.isEnabled;

  ngOnInit(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe((event) => this.onUpdateAvailable(event));
  }

  async checkForUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.showMessage('Checking for updates...');
    const updateFound = await this.swUpdate.checkForUpdate();
    if (!updateFound) {
      this.showMessage('You are on the latest version.');
    }
  }

  private onUpdateAvailable(event: VersionReadyEvent): void {
    const appData = event.latestVersion.appData as { updateMessage?: string } | undefined;
    const message = appData?.updateMessage ?? 'A new version is available.';

    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      data: { message },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (reloadNow: boolean) => {
      if (!reloadNow) {
        return;
      }

      await this.swUpdate.activateUpdate();
      document.location.reload();
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
