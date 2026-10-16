import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterielStorage } from '../services/materiel-storage';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  styleUrl: '../styles/home.css',
  template: `
    <main class="home-page">
      <section class="hero">
        <div class="hero-content">
          <p class="eyebrow">Campus matériel</p>
          <h1>Le bon équipement pour chaque projet.</h1>
          <p class="hero-text">
            Consultez le matériel disponible sur le campus et réservez simplement ce dont vous avez besoin.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/catalogue">
              Explorer le catalogue
              <mat-icon aria-hidden="true">arrow_forward</mat-icon>
            </a>
            <a mat-stroked-button routerLink="/connexion">Se connecter</a>
          </div>
        </div>
        <div class="hero-illustration" aria-hidden="true">
          <mat-icon>inventory_2</mat-icon>
          <span class="floating-icon icon-one"><mat-icon>laptop_mac</mat-icon></span>
          <span class="floating-icon icon-two"><mat-icon>videocam</mat-icon></span>
          <span class="floating-icon icon-three"><mat-icon>mic</mat-icon></span>
        </div>
      </section>

      <section class="stats" aria-label="Chiffres clés">
        <div class="stat">
          <mat-icon aria-hidden="true">devices</mat-icon>
          <div><strong>{{ storage.getEquipements()().length }}</strong><span>équipements</span></div>
        </div>
        <div class="stat">
          <mat-icon aria-hidden="true">check_circle</mat-icon>
          <div><strong>{{ storage.equipementsDisponibles().length }}</strong><span>disponibles</span></div>
        </div>
        <div class="stat">
          <mat-icon aria-hidden="true">category</mat-icon>
          <div><strong>{{ categories().size }}</strong><span>catégories</span></div>
        </div>
      </section>

      <section class="featured">
        <div class="section-heading">
          <div>
            <p class="eyebrow">À découvrir</p>
            <h2>Les équipements disponibles</h2>
          </div>
          <a mat-button routerLink="/catalogue">Voir tout <mat-icon>arrow_forward</mat-icon></a>
        </div>
        <div class="featured-grid">
          @for (equipment of featuredEquipments(); track equipment.id) {
            <mat-card>
              <div class="feature-icon"><mat-icon aria-hidden="true">devices</mat-icon></div>
              <p>{{ equipment.categorie }}</p>
              <h3>{{ equipment.nom }}</h3>
              <span><mat-icon>location_on</mat-icon>{{ equipment.localisation }}</span>
            </mat-card>
          } @empty {
            <p class="empty">Aucun équipement n'est disponible actuellement.</p>
          }
        </div>
      </section>

      <section class="how-it-works">
        <div>
          <p class="eyebrow">Simple et rapide</p>
          <h2>Comment ça marche ?</h2>
        </div>
        <div class="steps">
          <div><span>01</span><h3>Parcourez</h3><p>Découvrez le matériel disponible par catégorie.</p></div>
          <div><span>02</span><h3>Réservez</h3><p>Connectez-vous et réservez l'équipement choisi.</p></div>
          <div><span>03</span><h3>Utilisez</h3><p>Retrouvez vos réservations dans votre compte.</p></div>
        </div>
      </section>
    </main>
  `,
})
export class Home {
  protected readonly storage = inject(MaterielStorage);
  protected readonly featuredEquipments = computed(() =>
    this.storage.equipementsDisponibles().slice(0, 3),
  );
  protected readonly categories = computed(() =>
    new Set(this.storage.getEquipements()().map((equipment) => equipment.categorie)),
  );
}
