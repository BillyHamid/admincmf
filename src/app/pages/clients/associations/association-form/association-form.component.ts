import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DocumentRequisService } from '../../../../services/document-requis.service';
import { ClientService } from '../../../../services/client.service';
import { MessageService } from 'primeng/api';
import {Dialog} from "primeng/dialog";
import {ButtonDirective} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {NgForOf, NgIf} from "@angular/common";
import {Toast} from "primeng/toast";
import {AgencesService} from "../../../../services/agences.service";

@Component({
  selector: 'app-association-form',
  templateUrl: './association-form.component.html',
  styleUrls: ['./association-form.component.scss'],
  imports: [
    Dialog,
    ReactiveFormsModule,
    ButtonDirective,
    DropdownModule,
    NgForOf,
    Toast,
    NgIf
  ],
  providers: [MessageService]
})
export class AssociationFormComponent implements OnInit {
  @Output() onDone = new EventEmitter<void>();

  form: FormGroup;
  visible = false;
  files: { [key: string]: File } = {};
  requiredDocs: any[] = [];
  processing = false;
  @Input() forEdit: boolean = false;
  @Input() clientToEdit: any = null;
  agences: any = [];
  constructor(
    private fb: FormBuilder,
    private docService: DocumentRequisService,
    private clientService: ClientService,
    private messageService: MessageService,
    private agenceService: AgencesService
  ) {
    this.form = this.fb.group({
      nomOrganisation: ['', Validators.required],
      typeOrganisation: ['', Validators.required],
      domaineActivite: [''],
      adresse: ['', Validators.required],
      telephone1: ['', Validators.required],
      idSib: ['', Validators.required],
      telephone2: [''],
      email: ['', [Validators.email]],
      bp: [''],
      agenceId: ['',Validators.required],
      nomRepresentant: ['', Validators.required],
      prenomRepresentant: ['', Validators.required],
      sexeRepresentant: ['', Validators.required],
      telRepresentant: ['', Validators.required],
      emailRepresentant: [''],
      adresseRepresentant: ['']
    });
  }

  ngOnInit(): void {
    this.docService.getByDestinator('ASSOCIATION').subscribe({
      next: (docs) => (this.requiredDocs = docs),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les documents requis.'
        })
    });
    this.getAllAgence();
  }

  showDialog() {
    this.visible = true;
    if (this.forEdit) {
      this.clientToEdit.agenceId = this.clientToEdit.agenceRattachee?.uuid;
      this.form.patchValue(this.clientToEdit);
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

  submit() {
    this.processing = true;

    const missingFiles = this.requiredDocs.some(doc => !this.files[doc.uuid]);
    if (missingFiles && !this.forEdit) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Veuillez remplir tous les champs obligatoires et ajouter toutes les pièces.'
      });
      this.processing = false;
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(this.form.value));
    this.requiredDocs.forEach(doc => {
      formData.append(doc.uuid, this.files[doc.uuid]);
    });

    if (this.forEdit) {
      this.clientService.updateClientAssociation(this.clientToEdit.id, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Client mis à jour avec succès.'
          });
          this.resetForm();
          setTimeout(() => {
            this.onDone.emit();
            this.processing = false;
          }, 500);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.'
          });
          console.error(err);
          this.processing = false;
        }
      });
    } else {
      this.clientService.saveClientAssociation(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Client association enregistré avec succès.'
          });
          this.resetForm();
          this.processing = false;
          this.onDone.emit();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.'
          });
          console.error(err);
          this.processing = false;
        }
      });
    }
  }
}
