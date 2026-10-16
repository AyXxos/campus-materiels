import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CATEGORIES } from '../data/donnees-initiales';
import { Equipement } from '../interfaces/equipement';

@Component({
  selector: 'app-admin-equipment-dialog',
  imports: [MatDialogModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Modifier l'équipement</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="dialog-content">
        <label>
          Nom
          <input formControlName="nom" />
        </label>
        <label>
          Catégorie
          <select formControlName="categorie">
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </label>
        <label class="full-width">
          Description
          <textarea rows="4" formControlName="description"></textarea>
        </label>
        <label class="full-width">
          Localisation
          <input formControlName="localisation" />
        </label>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Annuler</button>
        <button mat-flat-button type="submit" [disabled]="form.invalid">
          Enregistrer
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .dialog-content {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      min-width: min(640px, 70vw);
      padding-top: 0.5rem;
    }

    label {
      display: grid;
      gap: 0.4rem;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.85rem;
      font-weight: 600;
    }

    input,
    select,
    textarea {
      box-sizing: border-box;
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--mat-sys-outline);
      border-radius: 0.5rem;
      background: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      font: inherit;
    }

    textarea {
      resize: vertical;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    @media (max-width: 650px) {
      .dialog-content {
        grid-template-columns: 1fr;
        min-width: 0;
      }
    }
  `,
})
export class AdminEquipmentDialog {
  private readonly dialogRef = inject(MatDialogRef<AdminEquipmentDialog>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly equipment = inject<Equipement>(MAT_DIALOG_DATA);
  protected readonly categories = CATEGORIES;
  protected readonly form = this.formBuilder.nonNullable.group({
    nom: [this.equipment.nom, Validators.required],
    categorie: [this.equipment.categorie, Validators.required],
    description: [this.equipment.description, Validators.required],
    localisation: [this.equipment.localisation, Validators.required],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
