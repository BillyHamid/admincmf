import {Component, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {UserFormComponent} from "../users/user-form/user-form.component";
import {AgencesService} from "../../../services/agences.service";
import {AgenceFormComponent} from "./agence-form/agence-form.component";
import {ButtonDirective} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
import {Tag} from "primeng/tag";

@Component({
  selector: 'app-agences',
  imports: [
    NgOptimizedImage,
    PrimeTemplate,
    TableModule,
    AgenceFormComponent,
    FormsModule,
    ButtonDirective,
    ConfirmDialog,
    Toast,
    Tag,
    NgIf
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './agences.component.html',
  styleUrl: './agences.component.scss'
})
export class AgencesComponent implements OnInit {
  agences!: any[];
  loading: boolean = false;

  constructor(
    private agenceService: AgencesService,
    private cs: ConfirmationService,
    private messageService: MessageService,) {
  }

  ngOnInit() {
    this.loadAgenceList();
  }

  loadAgenceList(){
    this.loading = true;
    this.agenceService.getAllAgences().subscribe((data: any) => {
      this.agences = data;
      this.loading = false;
    });
  }

  handleDelete(agence: any) {
    this.cs.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous vraiment supprimer cette agence ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-danger outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm mr-2',
      accept: () => {
        this.agenceService.delete(agence.uuid).subscribe({
          next: () => {
            this.loadAgenceList();
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Statut changé avec succès" });
          },
          error: (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }

  toggleStatus(agence: any) {
    this.cs.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous vraiment " + (agence.active ? "désactiver" : "activer") + " cette agence ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-danger outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm mr-2',
      accept: () => {
        this.agenceService.toggleStatus(agence.uuid).subscribe({
          next: () => {
            this.loadAgenceList();
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Agence supprimée" });
          },
          error: (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }

  onToggle(event: any, agence: any) {
    // On bloque le changement en restaurant la valeur initiale
    event.originalEvent.preventDefault();
    event.checked = agence.active; // on force la valeur à rester la même
  }
}
