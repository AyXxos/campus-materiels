import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  styleUrl: '../styles/error-pages.css',
  template: `
    <main class="status-page">
      <section class="status-card" aria-labelledby="not-found-title">
        <div class="status-icon status-icon--primary" aria-hidden="true">
          <mat-icon>search_off</mat-icon>
        </div>
        <p class="eyebrow">Erreur 404</p>
        <h1 id="not-found-title">Page introuvable</h1>
        <p class="status-description">
          Cette page n'existe pas ou l'adresse saisie est incorrecte.
          Revenez à l'accueil pour continuer votre recherche.
        </p>
        <div class="status-actions">
          <a mat-flat-button routerLink="/">
            <mat-icon aria-hidden="true">home</mat-icon>
            Retour à l'accueil
          </a>
          <a mat-stroked-button routerLink="/catalogue">Voir le catalogue</a>
        </div>
      </section>
    </main>
  `,
})
export class NotFound {}