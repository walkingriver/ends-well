import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface FooterLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-footer',
  imports: [
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  year = new Date().getFullYear();
  subscribeEmail = '';
  subscribeSuccess = false;

  readonly footerLinks: FooterLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Browse series', path: '/series' },
  ];

  onSubscribe(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.subscribeSuccess = true;
    form.resetForm();
  }
}
