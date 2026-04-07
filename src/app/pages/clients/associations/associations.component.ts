import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import {TableModule} from "primeng/table";
import {Sidebar} from "primeng/sidebar";
import {
  DatePipe,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  TitleCasePipe
} from "@angular/common";
import {Skeleton} from "primeng/skeleton";
import {ButtonDirective} from "primeng/button";
import {Toast} from "primeng/toast";
import {AssociationFormComponent} from "./association-form/association-form.component";
import {Tag} from "primeng/tag";
import {Drawer} from "primeng/drawer";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";
import {ConfirmDialog} from "primeng/confirmdialog";
import {FormsModule} from "@angular/forms";
import {ProgressSpinner} from "primeng/progressspinner";
import {ComptesComponent} from "../comptes/comptes.component";
import {ClientDetailsComponent} from "../client-details/client-details.component";
import {ClientPhysiqueCreateComponent} from "../physique/form/client-physique-create.component";
import {DropdownModule} from "primeng/dropdown";
import {Panel} from "primeng/panel";

@Component({
  selector: 'app-association',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss'],
  providers: [ConfirmationService, MessageService],
  imports: [
    TableModule,
    NgIf,
    ButtonDirective,
    Toast,
    AssociationFormComponent,
    Drawer,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    ConfirmDialog,
    FormsModule,
    NgOptimizedImage,
    ComptesComponent,
    ClientDetailsComponent,
    DropdownModule,
    Panel,
    Tag
  ],
  standalone: true
})
export class AssociationComponent implements OnInit {
  clients: any[] = [];
  loading = false;
  totalRecords = 0;
  displayClientDetails = false;
  currentClient: any = null;
  clientPieces: any[] = [];
  fileLoading = false;
  pieceLoading = false;
  toggleFilters = true;
  filters = {
    search: '',
    status: null
  };
  statusOptions = [
    { label: 'Tous les statuts', value: null },
    { label: 'En attente de création de compte', value: 'ACCOUNT_CREATION_PENDING' },
    { label: 'Rejetté', value: 'REJECTED' },
    { label: 'Validé', value: 'VALIDE' }
  ];
  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadClients(0, 10);
  }

  loadClients(page: number, size: number): void {
    this.loading = true;
    this.clientService.getAllClientAssociation(this.filters, page, size).subscribe({
      next: (data) => {
        this.clients = data.content;
        this.totalRecords = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadClientsLazy(event: any): void {
    const page = event.first / event.rows;
    const size = event.rows;
    this.loadClients(page, size);
  }

  showClientDetails(client: any): void {
    this.currentClient = client;
    this.displayClientDetails = true;
    this.getClientPiecesJustificatif();
  }

  getClientPiecesJustificatif(): void {
    this.pieceLoading = true;
    this.clientService.getClientPiecesJusticatif(this.currentClient?.id).subscribe({
      next: (data) => {
        this.clientPieces = data;
        this.pieceLoading = false;
      },
      error: () => {
        this.pieceLoading = false;
      }
    });
  }

  handleDelete(id: any) {
    this.confirmationService.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous supprimer ce client ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-primary outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm p-button-danger mr-2',
      accept: () => {
        this.clientService.delete(id).subscribe({
          next: () => {
            this.loadClients(0, 10);
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Client supprimé avec Succes" });
            this.displayClientDetails = false;
          },
          error: (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }


  visualiserPiece(url: string): void {
    this.fileLoading = true;
    this.clientService.downLoadPiece(url).subscribe({
      next: response => {
        const blob = response.body!;
        const disposition = response.headers.get('content-disposition') || '';
        const isInline = disposition.includes('inline');
        const filenameMatch = /filename="(.+)"/.exec(disposition);
        const filename = filenameMatch?.[1] || 'document';
        const fileUrl = window.URL.createObjectURL(blob);
        this.fileLoading = false;

        if (isInline) {
          window.open(fileUrl, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = fileUrl;
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

  resetFiltrer(){
    this.filters.search = '';
    this.filters.status = null;
    this.loadClients(0, 10);
  }

  filtrer(){
    this.loadClients(0, 10);
  }

  handleActiveMobile(clientId: any){
    this.loading = true;
    this.confirmationService.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous activer le compte mobile de ce client ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-primary outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm p-button-danger mr-2',
      accept: () => {
        this.clientService.activeClient(clientId).subscribe({
          next: () => {
            this.loading = false;
            this.loadClients(0, 10);
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Client activé avec Succes" });
          },
          error: (error: any) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }


  getFileExtension(url: string): string {
    return url?.split('.').pop()?.toLowerCase() || '';
  }
}
