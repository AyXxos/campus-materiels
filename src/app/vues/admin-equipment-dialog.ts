import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CATEGORIES } from '../data/donnees-initiales';
import { Equipement } from '../interfaces/equipement';

@Component({
  selector: 'app-admin-equipment-dialog',
  imports: [MatButtonModule, MatDialogModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? "Modifier l'équipement" : 'Ajouter un équipement' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="dialog-content">
        <label>
          Nom
          <input formControlName="nom" />
          @if (form.controls.nom.invalid && form.controls.nom.touched) {
            <span class="field-error">Le nom est obligatoire et doit contenir au moins 3 caractères.</span>
          }
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
          @if (form.controls.description.invalid && form.controls.description.touched) {
            <span class="field-error">La description est obligatoire et doit contenir au moins 10 caractères.</span>
          }
        </label>
        <label class="full-width">
          Localisation
          <input formControlName="localisation" />
          @if (form.controls.localisation.invalid && form.controls.localisation.touched) {
            <span class="field-error">La localisation est obligatoire.</span>
          }
        </label>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button class="cancel-button" mat-stroked-button type="button" mat-dialog-close>
          Annuler
        </button>
        <button class="submit-button" mat-flat-button type="submit" [disabled]="form.invalid">
          {{ isEdit ? 'Enregistrer les modifications' : 'Ajouter le matériel' }}
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

    label:nth-child(2) {
      max-width: 18rem;
    }

    .field-error {
      display: block;
      max-width: 100%;
      overflow: hidden;
      color: var(--mat-sys-error);
      font-size: 0.7rem;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
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

    mat-dialog-actions {
      gap: 0.75rem;
      padding: 1rem 1.5rem 1.5rem;
    }

    mat-dialog-actions button {
      min-height: 2.75rem;
      border-radius: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .cancel-button {
      border-color: var(--mat-sys-outline);
      color: var(--mat-sys-on-surface-variant);
    }

    .cancel-button:hover {
      background: var(--mat-sys-surface-container-high);
      border-color: var(--mat-sys-primary);
      color: var(--mat-sys-primary);
    }

    .submit-button {
      min-width: 13rem;
      box-shadow: 0 0.35rem 0.8rem rgb(20 45 75 / 16%);
    }

    .submit-button:hover:not(:disabled) {
      box-shadow: 0 0.5rem 1rem rgb(20 45 75 / 24%);
      transform: translateY(-1px);
    }

    .submit-button:disabled {
      box-shadow: none;
      opacity: 0.55;
    }

    @media (max-width: 650px) {
      .dialog-content {
        grid-template-columns: 1fr;
        min-width: 0;
      }

      label:nth-child(2) {
        max-width: none;
      }

      mat-dialog-actions {
        align-items: stretch;
        flex-direction: column-reverse;
      }

      mat-dialog-actions button {
        width: 100%;
      }

      .submit-button {
        min-width: 0;
      }

      .field-error {
        white-space: normal;
      }
    }
  `,
})
export class AdminEquipmentDialog {
  private readonly dialogRef = inject(MatDialogRef<AdminEquipmentDialog>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly equipment = inject<Equipement | null>(MAT_DIALOG_DATA, { optional: true });
  protected readonly categories = CATEGORIES;
  protected readonly isEdit = this.equipment !== null;
  protected readonly form = this.formBuilder.nonNullable.group({
    nom: [this.equipment?.nom ?? '', [Validators.required, Validators.minLength(3)]],
    categorie: [this.equipment?.categorie ?? CATEGORIES[0], Validators.required],
    description: [this.equipment?.description ?? '', [Validators.required, Validators.minLength(10)]],
    localisation: [this.equipment?.localisation ?? '', Validators.required],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
