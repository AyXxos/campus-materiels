import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { MaterielStorage } from '../services/materiel-storage';

@Component({
  selector: 'app-my-reservations',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  styleUrl: '../styles/my-reservations.css',
  template: `
    <section class="reservations-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Mon compte</p>
          <h2>Mes réservations</h2>
          <p>Retrouvez ici le matériel que vous avez réservé.</p>
        </div>
        <div class="reservation-count">
          <strong>{{ reservations().length }}</strong>
          réservation{{ reservations().length > 1 ? 's' : '' }}
        </div>
      </header>

      @if (reservations().length > 0) {
        <div class="reservation-list">
          @for (reservation of reservations(); track reservation.id) {
            <mat-card class="reservation-card">
              <div class="equipment-icon">
                <mat-icon aria-hidden="true">devices</mat-icon>
              </div>
              <div class="reservation-content">
                <div>
                  <p class="category">{{ reservation.equipement.categorie }}</p>
                  <h3>{{ reservation.equipement.nom }}</h3>
                  <p class="location">
                    <mat-icon aria-hidden="true">location_on</mat-icon>
                    {{ reservation.equipement.localisation }}
                  </p>
                </div>
                <div class="reservation-actions">
                  <a mat-button [routerLink]="['/materiel', reservation.equipement.id]">
                    Voir le détail
                  </a>
                  <button mat-stroked-button type="button" (click)="cancel(reservation.id)">
                    <mat-icon aria-hidden="true">event_busy</mat-icon>
                    Annuler
                  </button>
                </div>
              </div>
            </mat-card>
          }
        </div>
      } @else {
        <div class="empty-state">
          <mat-icon aria-hidden="true">event_available</mat-icon>
          <h3>Aucune réservation</h3>
          <p>Vous n'avez pas encore réservé de matériel.</p>
          <a mat-flat-button routerLink="/catalogue">Consulter le catalogue</a>
        </div>
      }
    </section>
  `,
})
export class MyReservations {
  private readonly auth = inject(AuthService);
  private readonly storage = inject(MaterielStorage);

  protected readonly reservations = computed(() => {
    const userId = this.auth.user()?.id;
    if (!userId) {
      return [];
    }

    return this.storage.getReservationsForStudent(userId)
      .map((reservation) => ({
        ...reservation,
        equipement: this.storage.getEquipementById(reservation.equipementId),
      }))
      .filter(
        (reservation): reservation is typeof reservation & { equipement: NonNullable<typeof reservation.equipement> } =>
          reservation.equipement !== undefined,
      );
  });

  protected cancel(reservationId: string): void {
    this.storage.removeReservation(reservationId);
  }
}
