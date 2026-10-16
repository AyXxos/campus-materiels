import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Navigation principale">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        Accueil
      </a>
      <a routerLink="/catalogue" routerLinkActive="active">Catalogue</a>
      @if (auth.user()) {
        <a routerLink="/compte" routerLinkActive="active">Mon compte</a>
        @if (auth.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active">Administration</a>
        }
        <span class="user">{{ auth.user()?.name }}</span>
        <button type="button" (click)="logout()">Se deconnecter</button>
      } @else {
        <a routerLink="/connexion" routerLinkActive="active">Se connecter</a>
      }
    </nav>
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