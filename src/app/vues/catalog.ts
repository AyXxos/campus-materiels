import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CATEGORIES } from '../data/donnees-initiales';
import { MaterielStorage } from '../services/materiel-storage';
import { EquipmentCard } from './components/equipment-card';

@Component({
  selector: 'app-catalog',
  imports: [
    MatIconModule,
    EquipmentCard,
  ],
  styleUrl: '../styles/catalog.css',
  template: `
    <div class="catalog-page">
      <header class="catalog-header">
        <div>
          <p class="eyebrow">Campus matériel</p>
          <h1>Le matériel dont vous avez besoin</h1>
          <p class="intro">
            Parcourez le catalogue et trouvez rapidement l'équipement disponible sur le campus.
          </p>
        </div>
        <div class="availability">
          <mat-icon aria-hidden="true">inventory_2</mat-icon>
          <span>
            <strong>{{ storage.equipementsDisponibles().length }}</strong>
            sur {{ storage.getEquipements()().length }} équipements disponibles
          </span>
        </div>
      </header>

      <section class="catalog-toolbar" aria-label="Filtres du catalogue">
        <div class="toolbar-title">
          <mat-icon aria-hidden="true">tune</mat-icon>
          <span>Filtrer le catalogue</span>
        </div>
        <label class="name-filter">
          <mat-icon aria-hidden="true">search</mat-icon>
          <span class="visually-hidden">Rechercher par nom</span>
          <input
            #searchInput
            type="search"
            placeholder="Rechercher par nom"
            [value]="searchTerm()"
            (input)="searchTerm.set(searchInput.value)"
          />
        </label>
        <label class="category-filter">
          <span>Catégorie</span>
          <select [value]="selectedCategory()" (change)="selectedCategory.set($any($event.target).value)">
            <option value="all">Toutes les catégories</option>
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </label>
        <label class="category-filter">
          <span>Disponibilité</span>
          <select [value]="selectedAvailability()" (change)="selectedAvailability.set($any($event.target).value)">
            <option value="all">Tous les équipements</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Indisponibles</option>
          </select>
        </label>
      </section>

      <section class="equipment-list" aria-label="Catalogue du matériel">
        @for (equipement of filteredEquipements(); track equipement.id) {
          <app-equipment-card
            [equipment]="equipement"
            [available]="storage.isEquipementDisponible(equipement.id)"
            (detailsRequested)="showDetails($event)"
          />
        } @empty {
          <div class="empty-state">
            @if (storage.getEquipements()().length === 0) {
              <mat-icon aria-hidden="true">inventory_2</mat-icon>
              <h2>Aucun équipement dans le catalogue</h2>
              <p>Il n'y a actuellement aucun matériel enregistré.</p>
            } @else {
              <mat-icon aria-hidden="true">search_off</mat-icon>
              <h2>Aucun équipement ne correspond aux critères</h2>
              <p>Modifiez le nom, la catégorie ou la disponibilité sélectionnée.</p>
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class Catalog {
  protected readonly storage = inject(MaterielStorage);
  private readonly router = inject(Router);
  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal('all');
  protected readonly selectedAvailability = signal('all');
  protected readonly searchTerm = signal('');

  protected showDetails(equipmentId: number): void {
    this.router.navigate(['/materiel', equipmentId]);
  }

  protected readonly filteredEquipements = computed(() => {
    const category = this.selectedCategory();
    const availability = this.selectedAvailability();
    const searchTerm = this.searchTerm().trim().toLocaleLowerCase();
    return this.storage.getEquipements()().filter(
      (equipement) =>
        (category === 'all' || equipement.categorie === category) &&
        (availability === 'all' ||
          (availability === 'available' && this.storage.isEquipementDisponible(equipement.id)) ||
          (availability === 'unavailable' && !this.storage.isEquipementDisponible(equipement.id))) &&
        equipement.nom.toLocaleLowerCase().includes(searchTerm),
    );
  });
}