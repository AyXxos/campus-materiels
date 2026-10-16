import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipment-detail',
  imports: [RouterLink],
  template: `
    <h1>Detail du materiel</h1>
    <p>Materiel demande : {{ equipmentId }}</p>
    <a routerLink="/compte/reservations">Voir mes reservations</a>
  `,
})
export class EquipmentDetail {
  protected readonly equipmentId = inject(ActivatedRoute).snapshot.paramMap.get('id');
}