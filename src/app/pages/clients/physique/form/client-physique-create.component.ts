import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../../services/client.service';
import { DocumentRequisService } from '../../../../services/document-requis.service';
import {Dialog} from "primeng/dialog";
import {ButtonDirective} from "primeng/button";
import {Toast} from "primeng/toast";
import {NgForOf, NgIf} from "@angular/common";
import {AgencesService} from "../../../../services/agences.service";
import {DropdownModule} from "primeng/dropdown";

interface DocumentRequis {
  uuid: string;
  libelle: string;
  type: string;
}

@Component({
  selector: 'app-client-physique-create',
  templateUrl: './client-physique-create.component.html',
  styleUrls: ['./client-physique-create.component.css'],
  imports: [
    Dialog,
    ReactiveFormsModule,
    ButtonDirective,
    Toast,
    NgForOf,
    DropdownModule,
    NgIf
  ],
  standalone: true,
  providers: [MessageService]
})
export class ClientPhysiqueCreateComponent implements OnInit {
  form: FormGroup;
  visible = false;
  files: { [key: string]: File } = {};
  requiredDocs: any[] = [];
  agences: any = [];
  @Input() forEdit: boolean = false;
  processing = false;
  @Input() clientToEdit: any = null;
  @Output()
  onUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private clientService: ClientService,
    private docService: DocumentRequisService,
    private messageService: MessageService,
    private agenceService: AgencesService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuNaissance: [''],
      profession: [''],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', Validators.required],
      idSib: ['', Validators.required],
      adresse: [''],
      employeur: [''],
      adresseEmployeur: [''],
      bp: [''],
      agenceId: ['',Validators.required],
      numeroCNIB: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRequiredDocs();
    this.getAllAgence();
  }

  loadRequiredDocs(): void {
    this.docService.getByDestinator('PERSONNE_PHYSIQUE').subscribe({
      next: (docs) => this.requiredDocs = docs,
      error: () => this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les documents requis'
      })
    });
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

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.files[key] = file;
    }
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

  submit() {
    this.processing = true;

    // Validation : tous les fichiers requis doivent être présents
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
      formData.append(doc.uuid, this.files[doc.uuid]); // clé = uuid du document
    });

    if (this.forEdit){

      this.clientService.updateClientPhysique(this.clientToEdit?.id, formData).subscribe({
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
      this.clientService.saveClientPhysique(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Client enregistré avec succès'
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
    }
  }
}
