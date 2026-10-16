import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <h1>Mon compte</h1>
    <nav aria-label="Navigation du compte">
      <a routerLink="materiel" routerLinkActive="active">Mon materiel</a>
      <a routerLink="reservations" routerLinkActive="active">Mes reservations</a>
      <a routerLink="settings" routerLinkActive="active">Parametres</a>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class Account {}
