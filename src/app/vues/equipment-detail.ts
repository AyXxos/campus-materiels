import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { MaterielStorage } from '../services/materiel-storage';

@Component({
  selector: 'app-equipment-detail',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  styleUrl: '../styles/equipment-detail.css',
  template: `
    <main class="detail-page">
      <a class="back-link" mat-button routerLink="/catalogue">
        <mat-icon aria-hidden="true">arrow_back</mat-icon>
        Retour au catalogue
      </a>

      @if (equipment(); as equipment) {
        <mat-card class="detail-card">
          <div class="detail-accent" aria-hidden="true"></div>
          <div class="detail-content">
            <div class="detail-icon" aria-hidden="true">
              <mat-icon>devices</mat-icon>
            </div>
            <div class="detail-main">
              <div class="detail-heading">
                <div>
                  <p class="eyebrow">{{ equipment.categorie }}</p>
                  <h1>{{ equipment.nom }}</h1>
                </div>
                <span class="status" [class.unavailable]="!isAvailable()">
                  <span class="status-dot" aria-hidden="true"></span>
                  {{ isAvailable() ? 'Disponible' : 'Indisponible' }}
                </span>
              </div>

              <p class="description">{{ equipment.description }}</p>

              <div class="location">
                <mat-icon aria-hidden="true">location_on</mat-icon>
                <div>
                  <span class="label">Localisation</span>
                  <strong>{{ equipment.localisation }}</strong>
                </div>
              </div>

              <div class="detail-actions">
                @if (isAvailable()) {
                  <button mat-flat-button type="button" (click)="reserve()">
                    <mat-icon aria-hidden="true">event_available</mat-icon>
                    Réserver ce matériel
                  </button>
                } @else {
                  <a mat-stroked-button routerLink="/compte/reservations">
                    Voir mes réservations
                  </a>
                }
                @if (message()) {
                  <p class="feedback" [class.error]="reservationFailed()" role="status">
                    {{ message() }}
                  </p>
                }
              </div>
            </div>
          </div>
        </mat-card>
      } @else {
        <section class="not-found">
          <mat-icon aria-hidden="true">search_off</mat-icon>
          <h1>Matériel introuvable</h1>
          <p>Le matériel demandé n'existe pas ou n'est plus disponible.</p>
          <a mat-flat-button routerLink="/catalogue">Retour au catalogue</a>
        </section>
      }
    </main>
  `,
})
export class EquipmentDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly storage = inject(MaterielStorage);
  private readonly equipmentId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly equipment = computed(() =>
    this.storage.getEquipementById(this.equipmentId),
  );
  protected readonly isAvailable = computed(() =>
    this.equipment() ? this.storage.isEquipementDisponible(this.equipmentId) : false,
  );
  protected readonly message = signal('');
  protected readonly reservationFailed = signal(false);

  protected reserve(): void {
    const user = this.auth.user();
    if (!user) {
      this.setFeedback('Connectez-vous pour réserver ce matériel.', true);
      return;
    }

    const reserved = this.storage.addReservation(this.equipmentId, user.id);
    this.setFeedback(
      reserved
        ? 'Matériel réservé avec succès.'
        : 'La réservation est impossible pour ce compte.',
      !reserved,
    );
  }

  private setFeedback(message: string, isError: boolean): void {
    this.message.set(message);
    this.reservationFailed.set(isError);
  }
}
