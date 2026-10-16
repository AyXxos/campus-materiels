# Campus Matériel

Application monopage Angular permettant de consulter le matériel du campus, de réserver des équipements et de gérer le catalogue avec un compte responsable.

## Prérequis

- Node.js compatible avec Angular 22 ;
- npm 11 ou version compatible ;
- un navigateur récent prenant en charge `localStorage`.

## Installation

Cloner le dépôt puis se placer dans le dossier du projet :

```bash
git clone https://github.com/AyXxos/campus-materiels.git
cd campus-materiels
```

Depuis le dossier du projet :

```bash
npm install
```

Le fichier `package-lock.json` permet de conserver des versions cohérentes des dépendances.

## Lancement

### Serveur de développement

```bash
npm start
```

L’application est ensuite disponible à l’adresse `http://localhost:4200`.

### Build de production

```bash
npm run build
```

### Tests

```bash
npm test -- --watch=false
```

### Serveur SSR après compilation

```bash
npm run build
npm run serve:ssr:campus-materiel
```

## Comptes de démonstration

La connexion est simulée côté frontend. Les comptes suivants sont disponibles :

| Profil | E-mail | Mot de passe | Nom |
|---|---|---|---|
| Étudiant | `user@example.com` | `user` | Alice Martin |
| Étudiant | `yanis@example.com` | `yanis` | Yanis Bernard |
| Responsable | `admin@example.com` | `admin` | Camille Dupont |

Les étudiants ne voient que leurs propres réservations. Le responsable peut gérer le catalogue et les réservations.

## Routes

| Route | Description | Accès |
|---|---|---|
| `/` | Page d’accueil | Public |
| `/catalogue` | Catalogue, recherche et filtres | Utilisateur connecté |
| `/materiel/:id` | Détail d’un équipement et réservation | Utilisateur connecté |
| `/connexion` | Connexion avec un compte de démonstration | Public |
| `/compte` | Espace compte, redirigé vers les réservations | Étudiant ou responsable connecté |
| `/compte/reservations` | Réservations du compte connecté | Utilisateur connecté |
| `/compte/settings` | Informations du compte | Utilisateur connecté |
| `/admin` | Gestion du matériel et des réservations | Responsable uniquement |
| `/acces-refuse` | Explication d’un accès interdit | Public |
| `/erreur-session` | Erreur de restauration de session | Public |
| Toute autre route | Page 404 | Public |

La route `/admin` est chargée en lazy loading car elle est plus rarement utilisée et est protégée par un guard responsable.

## Fonctionnalités réalisées

### Catalogue

- Six équipements initiaux répartis dans plusieurs catégories ;
- Recherche par nom dans le catalogue ;
- Filtre par catégorie ;
- Filtre par disponibilité ;
- Affichage des équipements disponibles et indisponibles ;
- Message explicite lorsqu’aucun résultat ne correspond ;
- Fiche détaillée accessible aux utilisateurs connectés ;
- Composant `EquipmentCard` réutilisable avec communication `input()` / `output()` avec le catalogue.

### Réservations

- Réservation d’un équipement disponible par un étudiant ;
- Une seule réservation active par équipement ;
- Réservation de plusieurs équipements différents par un même étudiant ;
- Affichage des réservations personnelles ;
- Annulation par l’étudiant ;
- Retrait d’une réservation par le responsable ;
- Confirmation avant toute annulation ou suppression ;
- Disponibilité calculée à partir des réservations actives.

### Administration

- Accès réservé au compte responsable ;
- Ajout d’un équipement ;
- Modification d’un équipement dans une modale ;
- Formulaire partagé entre l’ajout et la modification ;
- Validation du nom, de la description, de la catégorie et de la localisation ;
- Suppression d’un équipement après confirmation ;
- Suppression refusée lorsqu’un équipement est réservé ;
- Gestion des réservations actives.

### Authentification et navigation

- Session simulée persistée dans `localStorage` ;
- Restauration de la session après rechargement ;
- Déconnexion ;
- Guards pour les utilisateurs connectés et le rôle responsable ;
- Redirection vers la connexion pour les routes protégées ;
- Page d’accès refusé pour un utilisateur sans les droits ;
- Page 404 pour les routes inconnues ;
- Pages d’erreur de session et d’erreur de stockage ;
- Navigation responsive avec Angular Material.

### Persistance et état

- État partagé avec des signals Angular ;
- Catalogue, comptes et réservations conservés dans `localStorage` ;
- Initialisation des données uniquement lorsqu’aucune donnée n’est enregistrée ;
- Restauration des données au démarrage ;
- Messages utilisateur pour les problèmes de lecture, d’écriture, de données invalides et de stockage indisponible.

## Stockage local

Les clés utilisées sont :

- `campus-materiel-comptes`
- `campus-materiel-equipements`
- `campus-materiel-reservations`
- `campus-materiel-auth-user`

Les données sont locales au navigateur. Elles ne sont pas synchronisées entre plusieurs appareils ou navigateurs.

## Limites connues

- L’authentification est une simulation frontend : il n’y a pas de serveur, de hash de mot de passe ou de contrôle réel côté backend.
- Les comptes et mots de passe sont présents dans le code pour faciliter la démonstration.
- Les données sont conservées uniquement dans `localStorage` et peuvent être supprimées par l’utilisateur ou le navigateur.
- Les réservations ne possèdent pas de date de début ou de fin : le matériel reste réservé jusqu’à son annulation.
- Les routes utilisent `/connexion`, `/catalogue`, `/materiel/:id` et `/admin`, qui diffèrent des chemins proposés dans le sujet initial.
- Les erreurs de stockage affichent un message, mais ne peuvent pas rendre `localStorage` disponible lorsqu’il est bloqué ou inaccessible.

## Structure principale

```text
src/app/
├── data/                 Données initiales
├── interfaces/           Types Compte, Equipement et Reservation
├── services/             Authentification, guards et stockage local
├── styles/               Feuilles de style des pages
└── vues/                 Pages et composants standalone
```
