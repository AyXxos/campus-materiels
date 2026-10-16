import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './vues/components/navbar-component';
import { MaterielStorage } from './services/materiel-storage';

@Component({
  imports: [MatIconModule, NavbarComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly storage = inject(MaterielStorage);
  protected readonly storageError = this.storage.storageError;
}
