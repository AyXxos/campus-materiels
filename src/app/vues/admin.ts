import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Equipement } from '../interfaces/equipement';
import { MaterielStorage } from '../services/materiel-storage';
import { AdminEquipmentDialog } from './admin-equipment-dialog';

@Component({
  selector: 'app-admin',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    RouterLink,
  ],
  styleUrl: '../styles/admin.css',
  template: `
    <main class="admin-page">
      <header class="admin-header">
        <div>
          <p class="eyebrow">Administration</p>
          <h1>Gestion du matériel</h1>
          <p>Modifiez les équipements et gérez les réservations des étudiants.</p>
        </div>
        <a mat-stroked-button routerLink="/catalogue">
          <mat-icon aria-hidden="true">visibility</mat-icon>
          Voir le catalogue
        </a>
      </header>

      @if (feedback(); as feedback) {
        <p class="feedback" [class.error]="feedbackError()" role="status">{{ feedback }}</p>
      }

      <section class="admin-section">
        <div class="section-heading">
          <div>
            <p class="section-kicker">Inventaire</p>
            <h2>Matériel</h2>
          </div>
          <div class="section-heading-actions">
            <span class="section-count">{{ storage.equipementsReadonly().length }} équipements</span>
            <button mat-flat-button type="button" (click)="addEquipment()">
              <mat-icon aria-hidden="true">add</mat-icon>
              Ajouter
            </button>
          </div>
        </div>

        <div class="equipment-grid">
          @for (equipment of storage.equipementsReadonly(); track equipment.id) {
            <mat-card class="equipment-card">
              <div class="equipment-card-top">
                <div class="equipment-icon"><mat-icon aria-hidden="true">devices</mat-icon></div>
                <span class="availability" [class.unavailable]="!storage.isEquipementDisponible(equipment.id)">
                  {{ storage.isEquipementDisponible(equipment.id) ? 'Disponible' : 'Réservé' }}
                </span>
              </div>
              <p class="category">{{ equipment.categorie }}</p>
              <h3>{{ equipment.nom }}</h3>
              <p class="description">{{ equipment.description }}</p>
              <p class="location">
                <mat-icon aria-hidden="true">location_on</mat-icon>
                {{ equipment.localisation }}
              </p>
              <div class="card-actions">
                <button mat-stroked-button type="button" (click)="editEquipment(equipment.id)">
                  <mat-icon aria-hidden="true">edit</mat-icon>
                  Modifier
                </button>
                <button
                  mat-button
                  color="warn"
                  type="button"
                  [disabled]="!storage.isEquipementDisponible(equipment.id)"
                  (click)="deleteEquipment(equipment.id)"
                >
                  <mat-icon aria-hidden="true">delete</mat-icon>
                  Supprimer
                </button>
              </div>
            </mat-card>
          }
        </div>
      </section>

      <section class="admin-section reservations-section">
        <div class="section-heading">
          <div>
            <p class="section-kicker">Suivi</p>
            <h2>Réservations</h2>
          </div>
          <span class="section-count">{{ reservations().length }} réservations</span>
        </div>

        @if (reservations().length > 0) {
          <div class="reservation-list">
            @for (reservation of reservations(); track reservation.id) {
              <div class="reservation-row">
                <div class="row-icon"><mat-icon>event</mat-icon></div>
                <div class="row-content">
                  <strong>{{ reservation.equipement.nom }}</strong>
                  <span>Réservé par {{ reservation.etudiant.nom }}</span>
                </div>
                <button mat-stroked-button color="warn" type="button" (click)="cancelReservation(reservation.id)">
                  <mat-icon aria-hidden="true">event_busy</mat-icon>
                  Retirer
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <mat-icon aria-hidden="true">event_available</mat-icon>
            <p>Aucune réservation active.</p>
          </div>
        }
      </section>
    </main>
  `,
})
export class Admin {
  protected readonly storage = inject(MaterielStorage);
  private readonly dialog = inject(MatDialog);
  protected readonly feedback = signal('');
  protected readonly feedbackError = signal(false);

  protected readonly reservations = computed(() =>
    this.storage.getReservations()().map((reservation) => ({
      ...reservation,
      equipement: this.storage.getEquipementById(reservation.equipementId),
      etudiant: this.storage.getComptes()().find((compte) => compte.id === reservation.etudiantId),
    })).filter(
      (reservation): reservation is typeof reservation & {
        equipement: NonNullable<typeof reservation.equipement>;
        etudiant: NonNullable<typeof reservation.etudiant>;
      } => reservation.equipement !== undefined && reservation.etudiant !== undefined,
    ),
  );

  protected editEquipment(equipmentId: number): void {
    const equipment = this.storage.getEquipementById(equipmentId);
    if (!equipment) {
      this.showFeedback('Équipement introuvable.', true);
      return;
    }

    this.clearFeedback();
    const dialogRef = this.dialog.open(AdminEquipmentDialog, {
      data: equipment,
      width: '680px',
      maxWidth: 'calc(100vw - 2rem)',
    });
    dialogRef.afterClosed().subscribe((data: Omit<Equipement, 'id'> | undefined) => {
      if (!data) {
        return;
      }
      const updated = this.storage.updateEquipement(equipmentId, data);
      this.showFeedback(
        updated ? 'Équipement modifié avec succès.' : 'Impossible de modifier cet équipement.',
        !updated,
      );
    });
  }

  protected addEquipment(): void {
    this.clearFeedback();
    const dialogRef = this.dialog.open(AdminEquipmentDialog, {
      data: null,
      width: '680px',
      maxWidth: 'calc(100vw - 2rem)',
    });
    dialogRef.afterClosed().subscribe((data: Omit<Equipement, 'id'> | undefined) => {
      if (!data) {
        return;
      }
      this.storage.addEquipement(data);
      this.showFeedback('Équipement ajouté avec succès.', false);
    });
  }

  protected deleteEquipment(equipmentId: number): void {
    const equipment = this.storage.getEquipementById(equipmentId);
    if (!equipment || !window.confirm(`Supprimer « ${equipment.nom} » du catalogue ?`)) {
      return;
    }

    if (this.storage.removeEquipement(equipmentId)) {
      this.showFeedback('Équipement supprimé avec succès.', false);
    } else {
      this.showFeedback('Un équipement réservé ne peut pas être supprimé.', true);
    }
  }

  protected cancelReservation(reservationId: string): void {
    const reservation = this.reservations().find((item) => item.id === reservationId);
    if (
      !reservation ||
      !window.confirm(`Retirer la réservation de « ${reservation.equipement.nom} » ?`)
    ) {
      return;
    }

    if (this.storage.removeReservation(reservationId)) {
      this.showFeedback('Réservation retirée avec succès.', false);
    } else {
      this.showFeedback('Cette réservation n’existe plus.', true);
    }
  }

  private showFeedback(message: string, error: boolean): void {
    this.feedback.set(message);
    this.feedbackError.set(error);
  }

  private clearFeedback(): void {
    this.feedback.set('');
    this.feedbackError.set(false);
  }
}
