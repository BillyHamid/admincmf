import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {Button, ButtonDirective} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
import {Tag} from "primeng/tag";
import {CampagneService} from "../../services/notification.service";
import {CompteBancaireService} from "../../services/compteBancaireService";
import {Dialog} from "primeng/dialog";
import {ClientService} from "../../services/client.service";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-notifications-campagne',
  imports: [
    PrimeTemplate,
    TableModule,
    Button,
    FormsModule,
    ButtonDirective,
    ConfirmDialog,
    Toast,
    Tag,
    NgIf,
    DatePipe,
    Dialog,
    ReactiveFormsModule,
    DropdownModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './releve-request.component.html',
  standalone: true,
  styleUrl: './releve-request.component.scss'
})
export class ReleveRequestComponent implements OnInit {
  campagnes!: any[];
  // Filtres
  selectedClientId: string | null = null;
  selectedStatut: string | null = null;
  statutOptions = [
    { label: 'Tous', value: null },
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Envoyée', value: 'VALIDE' },
    { label: 'Rejetée', value: 'REJECTED' }
  ];

// Pagination
  page: number = 0;
  rows: number = 20;
  totalRecords: number = 0;
  loading: boolean = false;
  visible: boolean = false;
  processing: boolean = false;
  rejetVisible: boolean = false;
  rejetCommentaire: string = '';
  currentRequest: any;
  selectedFile: File = new File([], '');
  fileLoading: boolean = false;
  constructor(
    private compteBancaireService: CompteBancaireService,
    private cs: ConfirmationService,
    private clientService: ClientService,
    private messageService: MessageService,) {
  }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests(){
    this.loading = true;

    this.compteBancaireService.getReleveRequest({
      page: this.page,
      size: this.rows,
      statut: this.selectedStatut,
      compte: this.selectedClientId
    }).subscribe((response: any) => {
      this.campagnes = response.content;
      this.totalRecords = response.totalElements;
      this.loading = false;
    });
  }

  handleDelete(agence: any) {
    this.cs.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous vraiment supprimer cette campagne ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-danger outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm mr-2',
      accept: () => {
        // this.compteBancaireService.deleteCampagne(agence.id).subscribe({
        //   next: () => {
        //     this.loadRequests();
        //     this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Statut changé avec succès" });
        //   },
        //   error: (error: any) => {
        //     this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
        //   }
        // })
      }
    })
  }

  openDialog(request: any) {
    this.currentRequest = request;
    this.visible = true;
  }

  openRejetDialog(request: any) {
    this.currentRequest = request;
    this.rejetVisible = true;
  }



  saveForm(){
    this.processing = true;
    this.compteBancaireService.submitReleve(this.currentRequest?.uuid, this.selectedFile).subscribe(data => {
      this.processing = false;
      this.visible = false;
      this.loadRequests();
      this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Relevé soumis avec succès" });
    })

  }

  saveRejetForm(){
    this.processing = true;
    this.compteBancaireService.rejectReleve(this.currentRequest?.uuid, this.rejetCommentaire).subscribe(data => {
      this.processing = false;
      this.visible = false;
      this.loadRequests();
      this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Relevé rejetté avec succès" });
    })

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
    }
  }

  visualiserPiece(url: string): void {
    this.fileLoading = true;
    this.clientService.downLoadPiece(url).subscribe({
      next: response => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('content-disposition') || '';
        const isInline = contentDisposition.includes('inline');
        const matches = /filename="(.+)"/.exec(contentDisposition);
        const filename = matches?.[1] || 'document';
        this.fileLoading = false;

        const objectUrl = window.URL.createObjectURL(blob);

        if (isInline) {
          window.open(objectUrl, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = filename;
          link.click();
        }
      },
      error: () => {
        this.fileLoading = false;
        alert('Erreur lors de la récupération du fichier');
      }
    });
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.rows = event.rows;
    this.loadRequests();
  }

}
