import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../../services/client.service";
import {ButtonDirective} from "primeng/button";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
import {DropdownModule} from "primeng/dropdown";
import {AgencesService} from "../../../services/agences.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Dialog} from "primeng/dialog";

@Component({
  selector: 'app-details',
  imports: [
    ButtonDirective,
    DatePipe,
    NgForOf,
    NgIf,
    ConfirmDialog,
    Toast,
    DropdownModule,
    FormsModule,
    Dialog,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './details.component.html',
  standalone: true,
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  client: any;
  clientId: string = '';
  dossierId: string = '';
  loading: boolean = false;
  agences: any = []
  selectedAgence: any = null;
  fileLoading: boolean = false;
  kycDialogVisible: boolean = false;
  commentaire: any = null;
  kycRejectDialogVisible: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private messageService: MessageService,
    private cs: ConfirmationService,
    private router: Router,
    private agenceService: AgencesService

  ) {
  }

  ngOnInit(): void {
    this.getAllAgences()
    this.activatedRoute.params.subscribe(params => {
      this.clientId = params['clientId'];
      this.dossierId = params['dossierId'];
      this.getDossierDetails();
    });
  }

  getDossierDetails() {
    this.loading = true;
    this.clientService.getDossierDetails(this.dossierId).subscribe({
      next: (data: any) => {
        this.client = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });

  }

  visualiserPiece(url: string): void {
    this.fileLoading = true;
    this.clientService.downLoadPiece(url).subscribe({
      next: response => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('content-disposition') || '';
        console.log(contentDisposition)
        const isInline = contentDisposition.includes('inline');
        const matches = /filename="(.+)"/.exec(contentDisposition);
        const filename = matches?.[1] || 'document';
        this.fileLoading = false;

        const url = window.URL.createObjectURL(blob);

        if (isInline) {
          window.open(url, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
        }
      },
      error: () => {
        alert('Erreur lors de la récupération du fichier');
      }
    });
  }
  validerClient() {
    this.cs.confirm({
      key: 'kycConfirm',
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous valider le KYC de ce client ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-primary outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm p-button-danger mr-2',
      accept: () => {
        this.loading = true;
        this.clientService.validateKyc(this.dossierId).subscribe({
          next: () => {
            this.loading = false;
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/dossiers-clients']);
              });
            }, 100);
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "KYC du client validé avec Succes" });
          },
          error: (error: any) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }

  rejeterClient() {
    // appel API
  }

  getAllAgences() {
    this.agenceService.getAllAgences().subscribe({
      next: (res) => this.agences = res,
      error: (err) => console.error(err)
    });
  }

  ouvrirValidationKyc() {
    this.selectedAgence = null;
    this.getAllAgences();
    this.kycDialogVisible = true;
  }

  ouvrirRejectKyc() {
    this.commentaire = null;
    this.kycRejectDialogVisible = true;
  }

  confirmerValidationKyc() {
    if (!this.selectedAgence) return;

    this.loading = true;
    let data = {
      dossierUuid: this.dossierId,
      agentUuid: this.selectedAgence.uuid
    }
    this.clientService.validateKyc(data).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'KYC validé avec succès'
        });
        this.kycDialogVisible = false;
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/dossiers-clients']);
          });
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.message || 'Erreur serveur'
        });
      }
    });
  }

  rejeterValidationKyc() {
    if (!this.commentaire) return;

    this.loading = true;
    let data = {
      dossierUuid: this.dossierId,
      commentaire: this.commentaire
    }
    this.clientService.rejectKyc(data).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'KYC rejetté avec succès'
        });
        this.kycDialogVisible = false;
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/dossiers-clients']);
          });
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.message || 'Erreur serveur'
        });
      }
    });
  }


}
