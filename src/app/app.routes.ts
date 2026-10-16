import { Routes } from '@angular/router';
import { AccessDenied } from './vues/access-denied';
import { Admin } from './vues/admin';
import { Account } from './vues/account';
import { Catalog } from './vues/catalog';
import { EquipmentDetail } from './vues/equipment-detail';
import { Home } from './vues/home';
import { Login } from './vues/login';
import { MyEquipment } from './vues/my-equipment';
import { MyReservations } from './vues/my-reservations';
import { NotFound } from './vues/not-found';
import { Settings } from './vues/settings';
import { SessionError } from './vues/session-error';
import { adminGuard } from './services/admin.guard';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalogue', component: Catalog },
  { path: 'materiel/:id', component: EquipmentDetail },
  {
    path: 'compte',
    component: Account,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'materiel' },
      { path: 'materiel', component: MyEquipment },
      { path: 'reservations', component: MyReservations },
      { path: 'settings', component: Settings },
    ],
  },
  { path: 'reservations', pathMatch: 'full', redirectTo: 'compte/reservations' },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'connexion', component: Login },
  { path: 'acces-refuse', component: AccessDenied },
  { path: 'erreur-session', component: SessionError },
  { path: '**', component: NotFound },
];
