import {Component, OnInit} from '@angular/core';
import {DatePipe, JsonPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {NotificationFormComponent} from "./agence-form/notification-form.component";
import {Button, ButtonDirective} from "primeng/button";
import {ToggleSwitch} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
import {Tag} from "primeng/tag";
import {CampagneService} from "../../services/notification.service";

@Component({
  selector: 'app-notifications-campagne',
  imports: [
    NgOptimizedImage,
    PrimeTemplate,
    TableModule,
    NotificationFormComponent,
    JsonPipe,
    Button,
    ToggleSwitch,
    FormsModule,
    ButtonDirective,
    ConfirmDialog,
    Toast,
    Tag,
    NgIf,
    DatePipe
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './campagne-notifications.component.html',
  styleUrl: './campagne-notifications.component.scss'
})
export class CampagneNotificationsComponent implements OnInit {
  campagnes!: any[];
  loading: boolean = false;

  constructor(
    private campagneService: CampagneService,
    private cs: ConfirmationService,
    private messageService: MessageService,) {
  }

  ngOnInit() {
    this.loadAgenceList();
  }

  loadAgenceList(){
    this.loading = true;
    this.campagneService.getAllCampagne().subscribe((data: any) => {
      this.campagnes = data;
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
        this.campagneService.deleteCampagne(agence.id).subscribe({
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
}
