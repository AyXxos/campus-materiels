import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  imports: [MatIconModule, RouterLink, RouterLinkActive, RouterOutlet],
  styleUrl: '../styles/account.css',
  template: `
    <div class="account-page">
      <header class="account-hero">
        <div class="avatar" aria-hidden="true">{{ initials() }}</div>
        <div class="account-heading">
          <p class="eyebrow">Espace personnel</p>
          <h1>Bonjour, {{ auth.user()?.name }}</h1>
          <p>Gérez vos réservations et les informations de votre compte.</p>
        </div>
        <span class="role-badge">
          <mat-icon aria-hidden="true">verified_user</mat-icon>
          {{ auth.isAdmin() ? 'Gestionnaire' : 'Étudiant' }}
        </span>
      </header>

      <nav class="account-nav" aria-label="Navigation du compte">
        <a routerLink="reservations" routerLinkActive="active">
          <span class="nav-icon"><mat-icon aria-hidden="true">event</mat-icon></span>
          <span class="nav-copy">
            <strong>Mes réservations</strong>
            <small>Votre matériel réservé</small>
          </span>
          <mat-icon class="nav-arrow" aria-hidden="true">chevron_right</mat-icon>
        </a>
        <a routerLink="settings" routerLinkActive="active">
          <span class="nav-icon"><mat-icon aria-hidden="true">settings</mat-icon></span>
          <span class="nav-copy">
            <strong>Paramètres</strong>
            <small>Vos informations de compte</small>
          </span>
          <mat-icon class="nav-arrow" aria-hidden="true">chevron_right</mat-icon>
        </a>
      </nav>

      <div class="account-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class Account {
  protected readonly auth = inject(AuthService);

  protected initials(): string {
    return this.auth.user()?.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?';
  }
}
