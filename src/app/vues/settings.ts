import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [MatCardModule, MatIconModule],
  styleUrl: '../styles/settings.css',
  template: `
    <section class="settings-page">
      <header>
        <p class="eyebrow">Mon compte</p>
        <h2>Paramètres</h2>
        <p>Consultez les informations associées à votre compte.</p>
      </header>

      @if (auth.user(); as user) {
        <mat-card class="profile-card">
          <div class="profile-icon">
            <mat-icon aria-hidden="true">person</mat-icon>
          </div>
          <div>
            <span class="label">Nom du compte</span>
            <strong>{{ user.name }}</strong>
          </div>
        </mat-card>
        <mat-card class="profile-card">
          <div class="profile-icon">
            <mat-icon aria-hidden="true">badge</mat-icon>
          </div>
          <div>
            <span class="label">Type de compte</span>
            <strong>{{ user.role === 'manager' ? 'Gestionnaire' : 'Étudiant' }}</strong>
          </div>
        </mat-card>
      }
    </section>
  `,
})
export class Settings {
  protected readonly auth = inject(AuthService);
}
