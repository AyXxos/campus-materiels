import { Component } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  template: `
    <h1>Acces refuse</h1>
    <p>Vous n'avez pas les droits necessaires pour consulter cette page.</p>
  `,
})
export class AccessDenied {}