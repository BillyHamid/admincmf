import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { ButtonDirective } from 'primeng/button';

export interface LigneAmortissement {
  mois: number;
  mensualite: number;
  capital: number;
  interets: number;
  capitalRestant: number;
}

@Component({
  selector: 'app-simulateur-credit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf, ButtonDirective],
  templateUrl: './simulateur-credit.component.html',
  styleUrl: './simulateur-credit.component.scss'
})
export class SimulateurCreditComponent {
  form: FormGroup;
  resultat: {
    mensualite: number;
    totalInterets: number;
    totalRembourse: number;
  } | null = null;
  tableauAmortissement: LigneAmortissement[] = [];
  showTableau = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      montant: [1000000, [Validators.required, Validators.min(10000)]],
      dureeMois: [12, [Validators.required, Validators.min(1), Validators.max(360)]],
      tauxAnnuel: [12, [Validators.required, Validators.min(0.1), Validators.max(50)]]
    });
  }

  simuler() {
    if (this.form.invalid) return;

    const montant = this.form.value.montant;
    const dureeMois = this.form.value.dureeMois;
    const tauxAnnuel = this.form.value.tauxAnnuel;

    const tauxMensuel = tauxAnnuel / 100 / 12;
    let mensualite: number;

    if (tauxMensuel === 0) {
      mensualite = montant / dureeMois;
    } else {
      mensualite = montant * (tauxMensuel * Math.pow(1 + tauxMensuel, dureeMois)) /
        (Math.pow(1 + tauxMensuel, dureeMois) - 1);
    }

    const totalRembourse = mensualite * dureeMois;
    const totalInterets = totalRembourse - montant;

    this.resultat = {
      mensualite: Math.round(mensualite),
      totalInterets: Math.round(totalInterets),
      totalRembourse: Math.round(totalRembourse)
    };

    // Génération du tableau d'amortissement
    this.tableauAmortissement = [];
    let capitalRestant = montant;

    for (let m = 1; m <= dureeMois; m++) {
      const interets = capitalRestant * tauxMensuel;
      const capital = mensualite - interets;
      capitalRestant = Math.max(0, capitalRestant - capital);

      this.tableauAmortissement.push({
        mois: m,
        mensualite: Math.round(mensualite),
        capital: Math.round(capital),
        interets: Math.round(interets),
        capitalRestant: Math.round(capitalRestant)
      });
    }

    this.showTableau = true;
  }

  formatMontant(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value) + ' FCFA';
  }
}
