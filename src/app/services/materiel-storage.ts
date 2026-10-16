import { isPlatformBrowser } from '@angular/common';
import { computed, effect, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Compte } from '../interfaces/compte';
import { Equipement } from '../interfaces/equipement';
import { Reservation } from '../interfaces/reservation';
import {
  COMPTES_INITIAUX,
  EQUIPEMENTS_INITIAUX,
  RESERVATIONS_INITIALES,
} from '../data/donnees-initiales';

export type StorageError =
  | 'read'
  | 'write'
  | 'invalid'
  | 'unavailable';

@Injectable({ providedIn: 'root' })
export class MaterielStorage {
  private readonly comptes = signal<Compte[]>([]);
  private readonly equipements = signal<Equipement[]>([]);
  private readonly reservations = signal<Reservation[]>([]);
  private readonly browser: boolean;

  readonly comptesReadonly = this.comptes.asReadonly();
  readonly equipementsReadonly = this.equipements.asReadonly();
  readonly reservationsReadonly = this.reservations.asReadonly();
  readonly storageError = signal<StorageError | null>(null);
  readonly equipementsDisponibles = computed(() =>
    this.equipements().filter((equipement) => this.isEquipementDisponible(equipement.id)),
  );

  private readonly storageKeys = {
    comptes: 'campus-materiel-comptes',
    equipements: 'campus-materiel-equipements',
    reservations: 'campus-materiel-reservations',
  } as const;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.browser = isPlatformBrowser(platformId);
    this.initializeLocalStorage();
    this.loadFromLocalStorage();

    effect(() => {
      if (!this.browser) {
        return;
      }
      try {
        localStorage.setItem(this.storageKeys.comptes, JSON.stringify(this.comptes()));
        localStorage.setItem(this.storageKeys.equipements, JSON.stringify(this.equipements()));
        localStorage.setItem(this.storageKeys.reservations, JSON.stringify(this.reservations()));
      } catch {
        this.storageError.set('write');
        console.warn('Sauvegarde locale du matériel impossible');
      }
    });
  }

  getComptes() {
    return this.comptesReadonly;
  }

  getEquipements() {
    return this.equipementsReadonly;
  }

  getReservations() {
    return this.reservationsReadonly;
  }

  getEquipementById(equipementId: number): Equipement | undefined {
    return this.equipements().find((equipement) => equipement.id === equipementId);
  }

  getReservationsForStudent(etudiantId: number): Reservation[] {
    return this.reservations().filter((reservation) => reservation.etudiantId === etudiantId);
  }

  isEquipementDisponible(equipementId: number): boolean {
    return !this.reservations().some(
      (reservation) => reservation.equipementId === equipementId,
    );
  }

  addReservation(equipementId: number, etudiantId: number): boolean {
    const equipementExists = this.equipements().some(
      (equipement) => equipement.id === equipementId,
    );
    const studentExists = this.comptes().some(
      (compte) => compte.id === etudiantId && compte.role === 'student',
    );

    if (!equipementExists || !studentExists || !this.isEquipementDisponible(equipementId)) {
      return false;
    }

    this.reservations.update((reservations) => [
      ...reservations,
      { id: crypto.randomUUID(), equipementId, etudiantId },
    ]);
    return true;
  }

  removeReservation(reservationId: string): boolean {
    const reservationExists = this.reservations().some(
      (reservation) => reservation.id === reservationId,
    );
    if (!reservationExists) {
      return false;
    }
    this.reservations.update((reservations) =>
      reservations.filter((reservation) => reservation.id !== reservationId),
    );
    return true;
  }

  addEquipement(data: Omit<Equipement, 'id'>): Equipement {
    const equipement: Equipement = {
      ...data,
      id: this.createUniqueEquipementId(),
    };
    this.equipements.update((equipements) => [...equipements, equipement]);
    return equipement;
  }

  updateEquipement(equipementId: number, data: Omit<Equipement, 'id'>): boolean {
    const equipementExists = this.equipements().some(
      (equipement) => equipement.id === equipementId,
    );
    if (!equipementExists) {
      return false;
    }

    this.equipements.update((equipements) =>
      equipements.map((equipement) =>
        equipement.id === equipementId
          ? { ...data, id: equipementId }
          : equipement,
      ),
    );
    return true;
  }

  removeEquipement(equipementId: number): boolean {
    const equipementExists = this.equipements().some(
      (equipement) => equipement.id === equipementId,
    );
    if (!equipementExists || !this.isEquipementDisponible(equipementId)) {
      return false;
    }
    this.equipements.update((equipements) =>
      equipements.filter((equipement) => equipement.id !== equipementId),
    );
    return true;
  }

  private loadFromLocalStorage(): void {
    if (!this.browser) {
      this.comptes.set(this.clone(COMPTES_INITIAUX));
      this.equipements.set(this.clone(EQUIPEMENTS_INITIAUX));
      this.reservations.set(this.clone(RESERVATIONS_INITIALES));
      return;
    }

    this.comptes.set(this.loadOrInitialize(this.storageKeys.comptes, COMPTES_INITIAUX));
    this.equipements.set(
      this.loadOrInitialize(this.storageKeys.equipements, EQUIPEMENTS_INITIAUX),
    );
    this.reservations.set(
      this.loadOrInitialize(this.storageKeys.reservations, RESERVATIONS_INITIALES),
    );
  }

  private initializeLocalStorage(): void {
    if (!this.browser) {
      return;
    }

    const initialCollections = [
      [this.storageKeys.comptes, COMPTES_INITIAUX],
      [this.storageKeys.equipements, EQUIPEMENTS_INITIAUX],
      [this.storageKeys.reservations, RESERVATIONS_INITIALES],
    ] as const;

    try {
      for (const [key, initialData] of initialCollections) {
        if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(structuredClone(initialData)));
        }
      }
    } catch {
      this.storageError.set('unavailable');
      console.warn('Initialisation locale du matériel impossible');
    }
  }

  private loadOrInitialize<T>(key: string, initialData: T[]): T[] {
    let storedData: string | null;
    try {
      storedData = localStorage.getItem(key);
    } catch {
      if (this.storageError() === null) {
        this.storageError.set('read');
      }
      return this.clone(initialData);
    }

    if (storedData === null) {
      return this.clone(initialData);
    }
    try {
      const parsedData: unknown = JSON.parse(storedData);
      if (!Array.isArray(parsedData)) {
        throw new Error('Les données locales ne sont pas une collection.');
      }
      return parsedData as T[];
    } catch {
      this.storageError.set('invalid');
      console.warn(`Données locales invalides pour la clé ${key}`);
      return this.clone(initialData);
    }
  }

  private createUniqueEquipementId(): number {
    let id: number;
    do {
      id = Math.floor(Date.now() + Math.random() * 1000);
    } while (this.equipements().some((equipement) => equipement.id === id));
    return id;
  }

  private clone<T>(data: T[]): T[] {
    return structuredClone(data);
  }
}
