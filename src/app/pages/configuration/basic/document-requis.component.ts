import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {DocumentRequisService} from "../../../services/document-requis.service";
import {TabPanel, TabView} from "primeng/tabview";
import {NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {InputTextarea} from "primeng/inputtextarea";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";

export interface DocumentRequis {
  uuid?: string;
  libelle: string;
  description: string;
  type: string;
  destinator: 'PERSONNE_PHYSIQUE' | 'PERSONNE_MORALE' | 'ASSOCIATION' | 'MANDATAIRES';
}

@Component({
  selector: 'app-document-requis',
  templateUrl: './document-requis.component.html',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    TabView,
    TabPanel,
    PrimeTemplate,
    NgTemplateOutlet,
    Dialog,
    ReactiveFormsModule,
    Button,
    ConfirmDialog,
    Toast,
    TableModule,
    ButtonDirective,
    NgOptimizedImage,
    DropdownModule,
    NgIf
  ]
})
export class DocumentRequisComponent implements OnInit {
  visible = false;
  loading = false;
  processing = false;
  activeTabIndex = 0;

  documents: DocumentRequis[] = [];
  selectedDestinator: 'PERSONNE_PHYSIQUE' | 'PERSONNE_MORALE' | 'ASSOCIATION' | 'MANDATAIRES' = 'PERSONNE_PHYSIQUE';

  form: FormGroup;

  constructor(
    private documentService: DocumentRequisService,
    private fb: FormBuilder,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) {
    this.form = this.fb.group({
      libelle: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      destinator: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadList();
  }

  onTabChange(index: number): void {
    const values: any = ['PERSONNE_PHYSIQUE', 'PERSONNE_MORALE', 'ASSOCIATION', 'MANDATAIRES'];
    this.selectedDestinator = values[index];
    this.loadList();
  }

  loadList(): void {
    this.loading = true;
    this.documentService.getByDestinator(this.selectedDestinator).subscribe({
      next: (data) => {
        this.documents = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  showDialog(): void {
    this.form.reset();
    this.form.patchValue({ destinator: this.selectedDestinator });
    this.visible = true;
  }

  save(): void {
    if (this.form.invalid) return;
    this.processing = true;

    this.documentService.create(this.form.value).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Succès', detail: 'Document ajouté' });
        this.visible = false;
        this.loadList();
        this.processing = false;
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'ajout' });
        this.processing = false;
      }
    });
  }

  delete(doc: DocumentRequis): void {
    this.confirm.confirm({
      header: 'Confirmation',
      message: 'Voulez vous retirer ce document des documents requis ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.documentService.delete(doc.uuid!).subscribe(() => {
          this.toast.add({ severity: 'info', summary: 'Supprimé', detail: 'Document supprimé' });
          this.loadList();
        });
      }
    });
  }
}
