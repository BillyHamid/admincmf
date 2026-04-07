import {Component, OnInit} from '@angular/core';
import {AgencesService} from "../../../services/agences.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {Button, ButtonDirective} from "primeng/button";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
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
import {ClientService} from "../../../services/client.service";
import {Sidebar, SidebarModule} from "primeng/sidebar";
import {Drawer} from "primeng/drawer";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";
import {ClientPhysiqueCreateComponent} from "./form/client-physique-create.component";
import {Tag} from "primeng/tag";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Panel} from "primeng/panel";
import {ProgressSpinner} from "primeng/progressspinner";
import {ComptesComponent} from "../comptes/comptes.component";
import {ClientDetailsComponent} from "../client-details/client-details.component";

@Component({
  selector: 'app-physique',
  imports: [
    TableModule,
    ConfirmDialog,
    Toast,
    NgOptimizedImage,
    ButtonDirective,
    SidebarModule,
    Drawer,
    NgIf,
    TabList,
    Tabs,
    Tab,
    TabPanels,
    TabPanel,
    ClientPhysiqueCreateComponent,
    Tag,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    Panel,
    ProgressSpinner,
    ComptesComponent,
    ClientDetailsComponent
  ],
  providers: [ConfirmationService,MessageService],
  templateUrl: './physique.component.html',
  standalone: true,
  styleUrl: './physique.component.scss'
})
export class PhysiqueComponent implements OnInit {
  filters = {
    search: '',
    status: null
  };
  toggleFilters = true; // par défaut caché
  pieceLoading: boolean = false;
  statusOptions = [
    { label: 'Tous les statuts', value: null },
    { label: 'En attente de création de compte', value: 'ACCOUNT_CREATION_PENDING' },
    { label: 'Rejetté', value: 'REJECTED' },
    { label: 'Validé', value: 'VALIDE' }
  ];
  clients!: any[];
  loading: boolean = false;
  displayClientDetails: boolean = false;
  currentClient: any = null;
  clientPieces: any[] = [];
  totalRecords: number = 0;
  fileLoading: boolean = false;
  constructor(
    private clientService: ClientService,
    private cs: ConfirmationService,
    private messageService: MessageService,) {
  }

  ngOnInit() {
    this.loadClientList(0, 10);
  }

  loadClientList(page: number, size: number) {
    this.loading = true;
    this.clientService.getAllClientPhysique(this.filters, page, size).subscribe((data: any) => {
      this.clients = data?.content;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  loadClientsLazy(event: any): void {
    const page = event.first / event.rows;
    const size = event.rows;
    this.loadClientList(page, size);
  }

  handleActiveMobile(clientId: any){
    this.loading = true;
    this.cs.confirm({
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
            this.loadClientList(0, 10);
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

  handleDelete(id: any) {
    this.cs.confirm({
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
            this.loadClientList(0, 10);
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
  rejeterClient(id: any) {

  }

  onToggle(event: any, agence: any) {
    // On bloque le changement en restaurant la valeur initiale
    event.originalEvent.preventDefault();
    event.checked = agence.active; // on force la valeur à rester la même
  }

  filtrer(){
    this.loadClientList(0, 10);
  }

  resetFiltrer(){
    this.filters.search = '';
    this.filters.status = null;
    this.loadClientList(0, 10);
  }

  showClientDetails(client: any){
    this.displayClientDetails = true;
    this.currentClient = client;
    this.getClientPiecesJusticatif();
  }

  getClientPiecesJusticatif(){
    this.clientPieces = [];
    this.pieceLoading = true;
    this.clientService.getClientPiecesJusticatif(this.currentClient?.id).subscribe((data: any) => {
      this.clientPieces = data;
      this.pieceLoading = false;
    })
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
    });;
  }



  onFilterChange() {
    this.loadClientsLazy({ first: 0 }); // reload with filters
  }


  getFileExtension(url: string): string {
    return url?.split('.').pop()?.toLowerCase() || '';
  }

}
