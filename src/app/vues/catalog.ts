import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink],
  template: `
    <h1>Catalogue du materiel</h1>
    <p>Consultez le materiel disponible et ses details.</p>
    <a routerLink="/materiel/1">Voir un exemple de materiel</a>
  `,
})
export class Catalog {}