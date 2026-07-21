import { Component, signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  isLoading = signal(false);
  
  socialLinks = [
    { icon: 'facebook', url: 'https://facebook.com' },
    { icon: 'twitter', url: 'https://twitter.com' },
    { icon: 'instagram', url: 'https://instagram.com' },
    { icon: 'youtube', url: 'https://youtube.com' }
  ];
  
  footerLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'FAQ', path: '/faq' }
  ];

  constructor(private snackBar: MatSnackBar) {}

  onSubscribe(email: string): void {
    if (!email) {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.snackBar.open('Thanks for subscribing!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
  }
}
