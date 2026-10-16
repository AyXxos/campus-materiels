import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CATEGORIES } from '../data/donnees-initiales';
import { MaterielStorage } from '../services/materiel-storage';

@Component({
  selector: 'app-catalog',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
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
            équipement{{ storage.equipementsDisponibles().length > 1 ? 's' : '' }} disponible{{ storage.equipementsDisponibles().length > 1 ? 's' : '' }}
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
      </section>

      <section class="equipment-list" aria-label="Matériel disponible">
        @for (equipement of filteredEquipements(); track equipement.id) {
          <mat-card class="equipment-card">
            <div class="card-accent" aria-hidden="true"></div>
            <mat-card-header>
              <div mat-card-avatar class="equipment-icon">
                <mat-icon aria-hidden="true">devices</mat-icon>
              </div>
              <mat-card-title>{{ equipement.nom }}</mat-card-title>
              <mat-card-subtitle>{{ equipement.categorie }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="description">{{ equipement.description }}</p>
              <div class="equipment-meta">
                <div class="location">
                  <mat-icon aria-hidden="true">location_on</mat-icon>
                  <span>{{ equipement.localisation }}</span>
                </div>
                <span class="status">
                  <span class="status-dot" aria-hidden="true"></span>
                  Disponible
                </span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <a mat-flat-button [routerLink]="['/materiel', equipement.id]">
                Voir le détail
                <mat-icon aria-hidden="true">arrow_forward</mat-icon>
              </a>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <div class="empty-state">
            @if (storage.equipementsDisponibles().length === 0) {
              <mat-icon aria-hidden="true">inventory_2</mat-icon>
              <h2>Aucun équipement disponible</h2>
              <p>Il n'y a actuellement aucun équipement disponible.</p>
            } @else {
              <mat-icon aria-hidden="true">search_off</mat-icon>
              <h2>Aucun équipement ne correspond à votre recherche</h2>
              <p>Modifiez le nom recherché ou choisissez une autre catégorie.</p>
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class Catalog {
  protected readonly storage = inject(MaterielStorage);
  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal('all');
  protected readonly searchTerm = signal('');
  protected readonly filteredEquipements = computed(() => {
    const category = this.selectedCategory();
    const searchTerm = this.searchTerm().trim().toLocaleLowerCase();
    return this.storage.equipementsDisponibles().filter(
      (equipement) =>
        (category === 'all' || equipement.categorie === category) &&
        equipement.nom.toLocaleLowerCase().includes(searchTerm),
    );
  });
}