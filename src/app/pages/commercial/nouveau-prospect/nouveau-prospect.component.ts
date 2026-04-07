import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommercialService } from '../../../services/commercial.service';
import { DocumentRequisService } from '../../../services/document-requis.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { ButtonDirective } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nouveau-prospect',
  standalone: true,
  imports: [Tabs, TabList, Tab, TabPanels, TabPanel, ReactiveFormsModule, ButtonDirective, Toast, NgForOf, RouterLink],
  providers: [MessageService],
  templateUrl: './nouveau-prospect.component.html',
  styleUrl: './nouveau-prospect.component.scss'
})
export class NouveauProspectComponent implements OnInit {
  activeTab = '0';
  formPhysique!: FormGroup;
  formMoral!: FormGroup;
  formAssociation!: FormGroup;
  requiredDocsPhysique: any[] = [];
  requiredDocsMoral: any[] = [];
  requiredDocsAssociation: any[] = [];
  filesPhysique: Record<string, File> = {};
  filesMoral: Record<string, File> = {};
  filesAssociation: Record<string, File> = {};
  processing = false;

  constructor(
    private fb: FormBuilder,
    private commercialService: CommercialService,
    private docService: DocumentRequisService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formPhysique = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuNaissance: [''],
      profession: [''],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', Validators.required],
      adresse: [''],
      employeur: [''],
      adresseEmployeur: [''],
      bp: [''],
      numeroCNIB: ['', Validators.required]
    });
    this.formMoral = this.fb.group({
      raisonSociale: ['', Validators.required],
      rccm: [''],
      numIfu: [''],
      formeJuridique: [''],
      domaineActivite: [''],
      nomResponsable: ['', Validators.required],
      prenomResponsable: ['', Validators.required],
      sexeResponsable: [''],
      telResponsable: ['', Validators.required],
      emailResponsable: ['', Validators.required],
      adresseResponsable: [''],
      adresse: [''],
      email: ['', Validators.required],
      telephone1: ['', Validators.required]
    });
    this.formAssociation = this.fb.group({
      nomOrganisation: ['', Validators.required],
      typeOrganisation: [''],
      domaineActivite: [''],
      nomRepresentant: ['', Validators.required],
      prenomRepresentant: ['', Validators.required],
      sexeRepresentant: [''],
      telRepresentant: ['', Validators.required],
      emailRepresentant: ['', Validators.required],
      adresseRepresentant: [''],
      adresse: [''],
      email: ['', Validators.required],
      telephone1: ['', Validators.required]
    });
    this.loadDocs();
  }

  loadDocs() {
    this.docService.getByDestinator('PERSONNE_PHYSIQUE').subscribe(d => this.requiredDocsPhysique = d);
    this.docService.getByDestinator('PERSONNE_MORALE').subscribe(d => this.requiredDocsMoral = d);
    this.docService.getByDestinator('ASSOCIATION').subscribe(d => this.requiredDocsAssociation = d);
  }

  onFileChange(event: any, key: string, type: string) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'physique') this.filesPhysique[key] = file;
      else if (type === 'moral') this.filesMoral[key] = file;
      else this.filesAssociation[key] = file;
    }
  }

  submitPhysique() {
    if (this.formPhysique.invalid) return;
    const missing = this.requiredDocsPhysique.some(d => !this.filesPhysique[d.uuid]);
    if (missing) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Veuillez joindre toutes les pièces requises.' });
      return;
    }
    this.processing = true;
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.formPhysique.value));
    this.requiredDocsPhysique.forEach(d => formData.append(d.uuid, this.filesPhysique[d.uuid]));
    this.commercialService.creerProspectPhysique(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Prospect créé' });
        this.router.navigate(['/commercial/prospects']);
        this.processing = false;
      },
      error: () => { this.processing = false; }
    });
  }

  submitMoral() {
    if (this.formMoral.invalid) return;
    const missing = this.requiredDocsMoral.some(d => !this.filesMoral[d.uuid]);
    if (missing) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Veuillez joindre toutes les pièces requises.' });
      return;
    }
    this.processing = true;
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.formMoral.value));
    this.requiredDocsMoral.forEach(d => formData.append(d.uuid, this.filesMoral[d.uuid]));
    this.commercialService.creerProspectMoral(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Prospect créé' });
        this.router.navigate(['/commercial/prospects']);
        this.processing = false;
      },
      error: () => { this.processing = false; }
    });
  }

  submitAssociation() {
    if (this.formAssociation.invalid) return;
    const missing = this.requiredDocsAssociation.some(d => !this.filesAssociation[d.uuid]);
    if (missing) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Veuillez joindre toutes les pièces requises.' });
      return;
    }
    this.processing = true;
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.formAssociation.value));
    this.requiredDocsAssociation.forEach(d => formData.append(d.uuid, this.filesAssociation[d.uuid]));
    this.commercialService.creerProspectAssociation(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Prospect créé' });
        this.router.navigate(['/commercial/prospects']);
        this.processing = false;
      },
      error: () => { this.processing = false; }
    });
  }
}
