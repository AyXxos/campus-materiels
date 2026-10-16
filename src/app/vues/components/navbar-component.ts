import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, RouterLinkActive],
  styleUrl: './navbar-component.css',
  template: `
    <mat-toolbar class="navbar" role="navigation" aria-label="Navigation principale">
      <a
        class="brand"
        mat-button
        routerLink="/"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
        aria-label="Retour à l'accueil"
      >
        <mat-icon aria-hidden="true">inventory_2</mat-icon>
        <span>Accueil</span>
      </a>

      <div class="nav-links">
        <a mat-button routerLink="/catalogue" routerLinkActive="active">Catalogue</a>
        @if (auth.user()) {
          <a mat-button routerLink="/compte" routerLinkActive="active">Mon compte</a>
        }
      </div>

      <span class="spacer"></span>

      @if (auth.user(); as user) {
        @if (auth.isAdmin()) {
          <a mat-button routerLink="/admin" routerLinkActive="active">
            <mat-icon aria-hidden="true">admin_panel_settings</mat-icon>
            Administration
          </a>
        }
        <span class="user-name">{{ user.name }}</span>
        <button mat-stroked-button type="button" (click)="logout()">
          <mat-icon aria-hidden="true">logout</mat-icon>
          Déconnexion
        </button>
      } @else {
        <a mat-flat-button routerLink="/connexion">
          <mat-icon aria-hidden="true">login</mat-icon>
          Connexion
        </a>
      }
    </mat-toolbar>
  `,
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}