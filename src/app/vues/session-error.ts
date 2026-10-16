import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-session-error',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  styleUrl: '../styles/error-pages.css',
  template: `
    <main class="status-page">
      <section class="status-card" aria-labelledby="session-error-title">
        <div class="status-icon status-icon--error" aria-hidden="true">
          <mat-icon>sync_problem</mat-icon>
        </div>
        <p class="eyebrow">Session</p>
        <h1 id="session-error-title">Votre session a rencontré un problème</h1>
        <p class="status-description">
          Nous n'avons pas pu charger votre session correctement.
          Reconnectez-vous pour reprendre votre navigation en toute sécurité.
        </p>
        <div class="status-actions">
          <a mat-flat-button routerLink="/connexion">
            <mat-icon aria-hidden="true">login</mat-icon>
            Se reconnecter
          </a>
          <a mat-stroked-button routerLink="/">Retour à l'accueil</a>
        </div>
      </section>
    </main>
  `,
})
export class SessionError {}
