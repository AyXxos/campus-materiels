import { Component } from '@angular/core';

@Component({
  selector: 'app-session-error',
  template: `
    <h1>Erreur de session</h1>
    <p>La session ne peut pas etre chargee. Veuillez reessayer.</p>
  `,
})
export class SessionError {}
