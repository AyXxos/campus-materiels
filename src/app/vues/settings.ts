import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  template: `
    <h2>Parametres</h2>
    @if (auth.user(); as user) {
      <p>Compte connecte : {{ user.name }}</p>
      <p>Role : {{ user.role }}</p>
    }
    <p>Les parametres du compte seront disponibles prochainement.</p>
  `,
})
export class Settings {
  protected readonly auth = inject(AuthService);
}
