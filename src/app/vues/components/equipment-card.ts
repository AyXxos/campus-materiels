import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Equipement } from '../../interfaces/equipement';

@Component({
  selector: 'app-equipment-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  styleUrl: './equipment-card.css',
  template: `
    <mat-card class="equipment-card">
      <div class="card-accent" aria-hidden="true"></div>
      <mat-card-header>
        <div mat-card-avatar class="equipment-icon">
          <mat-icon aria-hidden="true">devices</mat-icon>
        </div>
        <mat-card-title>{{ equipment().nom }}</mat-card-title>
        <mat-card-subtitle>{{ equipment().categorie }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="description">{{ equipment().description }}</p>
        <div class="equipment-meta">
          <div class="location">
            <mat-icon aria-hidden="true">location_on</mat-icon>
            <span>{{ equipment().localisation }}</span>
          </div>
          <span class="status" [class.unavailable]="!available()">
            <span class="status-dot" aria-hidden="true"></span>
            {{ available() ? 'Disponible' : 'Indisponible' }}
          </span>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-flat-button type="button" (click)="detailsRequested.emit(equipment().id)">
          Voir le détail
          <mat-icon aria-hidden="true">arrow_forward</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class EquipmentCard {
  readonly equipment = input.required<Equipement>();
  readonly available = input.required<boolean>();
  readonly detailsRequested = output<number>();
}
