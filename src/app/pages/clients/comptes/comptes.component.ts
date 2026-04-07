import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CompteBancaireService} from "../../../services/compteBancaireService";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {DocumentRequisService} from "../../../services/document-requis.service";
import {MessageService, PrimeTemplate} from "primeng/api";
import {Accordion, AccordionTab} from "primeng/accordion";
import {Message} from "primeng/message";
import {ProgressSpinner} from "primeng/progressspinner";
import {DropdownModule} from "primeng/dropdown";
import {ServicesService} from "../../../services/services.service";

@Component({
  selector: 'app-comptes',
  imports: [
    ButtonDirective,
    Dialog,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    Accordion,
    AccordionTab,
    Message,
    PrimeTemplate,
    ProgressSpinner,
    NgOptimizedImage,
    DropdownModule
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.scss'
})
export class ComptesComponent implements OnInit,OnChanges {

  @Input()
  clientId: string = '';
  comptes: any[] = [];
  form!: FormGroup;
  visible = false;
  processing = false;
  loading = false;
  requiredDocs: any[] = [];
  services: any[] = [];

  mandataireFiles: Map<number, { [key: string]: File }> = new Map();

  constructor(private fb: FormBuilder,
              private compteService: CompteBancaireService,
              private docService: DocumentRequisService,
              private messageService: MessageService,
              private serviceService: ServicesService) {}

  ngOnInit() {
    this.loadRequiredDocs();
    this.getAllServices();
    this.form = this.fb.group({
      libelle: ['', Validators.required],
      numeroCompte: ['', Validators.required],
      typeCompte: ['', Validators.required],
      clientId: [this.clientId], // injecter dynamiquement
      mandataires: this.fb.array([])
    });
  }

  getAllServices() {
    this.serviceService.getAll().subscribe({
      next: (res) => {
        this.services = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des services:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les services'
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientId'] && this.clientId) {
      console.log('Client ID reçu :', this.clientId);
      this.getCLientComptes();
    }
  }

  getCLientComptes(){
    this.loading = true;
    this.compteService.getByClient(this.clientId).subscribe({
      next: (res) => {
        this.loading = false;
        this.comptes = res;
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }
    });
  }

  get mandataires(): FormArray {
    return this.form.get('mandataires') as FormArray;
  }

  addMandataire() {
    this.mandataires.push(this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: [''],
      lienParente: [''],
      telephone: [''],
      email: [''],
      fichiersJustificatifs: [{}]
    }));
  }

  removeMandataire(index: number) {
    this.mandataires.removeAt(index);
    this.mandataireFiles.delete(index);
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


  onMandataireFileChange(event: Event, mandataireIndex: number, docUuid: string) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const files = this.mandataireFiles.get(mandataireIndex) || {};
      files[docUuid] = input.files[0];
      this.mandataireFiles.set(mandataireIndex, files);
    }
  }

  showDialog() {
    this.resetForm();
    // this.addMandataire();
    this.visible = true;

  }

  resetForm() {
    this.form.reset();
    this.mandataires.clear();
    this.mandataireFiles.clear();
    this.visible = false;
  }

  submit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    const rawCommand = this.form.value;
    rawCommand.clientId = this.clientId;

    // Ajouter les fichiers
    rawCommand.mandataires.forEach((mandataire: any, index: number) => {
      const files = this.mandataireFiles.get(index);
      mandataire.fichiersJustificatifs = {};

      if (files) {
        Object.entries(files).forEach(([uuid, file]) => {
          formData.append(`mandataires[${index}].fichiersJustificatifs[${uuid}]`, file);
        });
      }
    });

    formData.append('command', new Blob([JSON.stringify(rawCommand)], { type: 'application/json' }));
    this.processing = true;
    this.compteService.creerCompte(formData).subscribe({
      next: () => {
        this.processing = false;
        this.resetForm();
        this.getCLientComptes();
      },
      error: () => {
        this.processing = false;
        // toast erreur ici
      }
    });
  }
}
