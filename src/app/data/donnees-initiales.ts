import { Compte } from '../interfaces/compte';
import { Categorie, Equipement } from '../interfaces/equipement';
import { Reservation } from '../interfaces/reservation';

export const CATEGORIES: Categorie[] = [
  'Informatique',
  'Projection',
  'Photo',
  'Audio',
];

export const COMPTES_INITIAUX: Compte[] = [
  { id: 1, nom: 'Alice Martin', role: 'student' },
  { id: 2, nom: 'Yanis Bernard', role: 'student' },
  { id: 3, nom: 'Camille Dupont', role: 'manager' },
];

export const EQUIPEMENTS_INITIAUX: Equipement[] = [
  {
    id: 101,
    nom: 'Ordinateur portable 01',
    categorie: 'Informatique',
    description: 'Ordinateur portable avec chargeur et souris USB.',
    localisation: 'Salle informatique B201',
  },
  {
    id: 102,
    nom: 'Ordinateur portable 02',
    categorie: 'Informatique',
    description: 'Second ordinateur portable avec chargeur et souris USB.',
    localisation: 'Salle informatique B201',
  },
  {
    id: 103,
    nom: 'Vidéoprojecteur mobile',
    categorie: 'Projection',
    description: 'Vidéoprojecteur avec câble HDMI et télécommande.',
    localisation: 'Réserve B204',
  },
  {
    id: 104,
    nom: 'Appareil photo numérique',
    categorie: 'Photo',
    description: 'Appareil photo avec objectif, batterie et carte mémoire.',
    localisation: 'Studio C102',
  },
  {
    id: 105,
    nom: 'Microphone USB',
    categorie: 'Audio',
    description: 'Microphone de bureau avec pied et câble USB.',
    localisation: 'Studio C102',
  },
  {
    id: 106,
    nom: 'Enceinte portable',
    categorie: 'Audio',
    description: 'Enceinte rechargeable avec câble audio et alimentation.',
    localisation: 'Réserve B204',
  },
];

export const RESERVATIONS_INITIALES: Reservation[] = [];
