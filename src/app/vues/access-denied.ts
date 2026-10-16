import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-access-denied',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  styleUrl: '../styles/error-pages.css',
  template: `
    <main class="status-page">
      <section class="status-card" aria-labelledby="access-denied-title">
        <div class="status-icon status-icon--warning" aria-hidden="true">
          <mat-icon>lock</mat-icon>
        </div>
        <p class="eyebrow">Accès protégé</p>
        <h1 id="access-denied-title">Accès refusé</h1>
        <p class="status-description">
          Vous n'avez pas les droits nécessaires pour consulter cette page.
          Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur.
        </p>
        <div class="status-actions">
          <a mat-flat-button routerLink="/">
            <mat-icon aria-hidden="true">home</mat-icon>
            Retour à l'accueil
          </a>
          <a mat-stroked-button routerLink="/catalogue">Consulter le catalogue</a>
        </div>
      </section>
    </main>
  `,
})
export class AccessDenied {}