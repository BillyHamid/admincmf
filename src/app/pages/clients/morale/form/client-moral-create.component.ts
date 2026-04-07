import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ClientService } from '../../../../services/client.service';
import { DocumentRequisService } from '../../../../services/document-requis.service';
import { MessageService } from 'primeng/api';
import {Toast} from "primeng/toast";
import {ButtonDirective} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {Dialog} from "primeng/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {AgencesService} from "../../../../services/agences.service";

@Component({
  selector: 'app-client-moral-create',
  templateUrl: './client-moral-create.component.html',
  styleUrls: ['./client-physique-create.component.css'],
  standalone: true,
  imports: [
    Toast,
    ButtonDirective,
    DropdownModule,
    Dialog,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  providers: [MessageService]
})
export class ClientMoralCreateComponent implements OnInit {
  form: FormGroup;
  visible = false;
  files: { [key: string]: File } = {};
  requiredDocs: any[] = [];
  agences: any = [];
  processing = false;
  @Input() forEdit: boolean = false;
  @Input() clientToEdit: any = null;
  @Output() onUpdate = new EventEmitter<unknown>();
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private docService: DocumentRequisService,
    private messageService: MessageService,
    private agenceService: AgencesService
  ) {
    this.form = this.fb.group({
      raisonSociale: ['', Validators.required],
      rccm: ['', Validators.required],
      numIfu: ['', Validators.required],
      formeJuridique: ['', Validators.required],
      domaineActivite: [''],
      adresse: ['', Validators.required],
      telephone1: ['', Validators.required],
      idSib: ['', Validators.required],
      telephone2: [''],
      email: ['', [Validators.email]],
      bp: [''],
      agenceId: ['',Validators.required],
      nomResponsable: ['', Validators.required],
      prenomResponsable: ['', Validators.required],
      sexeResponsable: ['', Validators.required],
      telResponsable: ['', Validators.required],
      emailResponsable: [''],
      adresseResponsable: ['']
    });
  }

  ngOnInit(): void {
    this.loadRequiredDocs();
    this.getAllAgence();
  }

  loadRequiredDocs() {
    this.docService.getByDestinator('PERSONNE_MORALE').subscribe({
      next: (docs) => this.requiredDocs = docs,
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les documents requis'
        });
      }
    });
  }

  showDialog() {
    this.visible = true;
    if (this.forEdit) {
      this.clientToEdit.agenceId = this.clientToEdit.agenceRattachee?.uuid;
      this.form.patchValue(this.clientToEdit);
    }
  }

  resetForm() {
    this.form.reset();
    this.files = {};
    this.visible = false;
  }

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.files[key] = file;
    }
  }

  getAllAgence(){
    this.agenceService.getAllAgences().subscribe({
      next: (data) => {
        this.agences = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des agences'
        });
        console.error(err);
      }
    });
  }

  submit() {
    this.processing = true;

    const missingFiles = this.requiredDocs.some(doc => !this.files[doc.uuid]);
    if (missingFiles && !this.forEdit) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Veuillez remplir tous les champs et ajouter toutes les pièces demandées.'
      });
      this.processing = false;
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.form.value));
    this.requiredDocs.forEach(doc => {
      formData.append(doc.uuid, this.files[doc.uuid]);
    });

    if (this.forEdit){
      this.clientService.updateClientMoral(this.clientToEdit?.id, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Client mis a jour avec succès'
          });
          this.resetForm();
          setTimeout(() => {
            this.onUpdate.emit();
            this.processing = false;
          }, 500);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de l’enregistrement'
          });
          console.error(err);
          this.processing = false;
        }
      });
    } else {
      this.clientService.saveClientMoral(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Client enregistré avec succès'
          });
          this.resetForm();
          this.processing = false;
          this.onUpdate.emit();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de l’enregistrement'
          });
          console.error(err);
          this.processing = false;
        }
      });
    }


  }
}
