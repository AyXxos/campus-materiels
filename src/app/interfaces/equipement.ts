export type Categorie = 'Informatique' | 'Projection' | 'Photo' | 'Audio';

export interface Equipement {
  id: number;
  nom: string;
  categorie: Categorie;
  description: string;
  localisation: string;
}
