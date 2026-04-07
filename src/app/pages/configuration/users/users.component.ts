import {Component, OnInit} from '@angular/core';
import {Tab, TabList, Tabs} from "primeng/tabs";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TableModule} from "primeng/table";
import {ButtonDirective} from "primeng/button";
import {UserFormComponent} from "./user-form/user-form.component";
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {UsersService} from "../../../services/users.service";
import {ToggleSwitch} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";
import {Tag} from "primeng/tag";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";

@Component({
  selector: 'app-users',
  imports: [
    PrimeTemplate,
    TableModule,
    UserFormComponent,
    NgOptimizedImage,
    FormsModule,
    NgIf,
    Tag,
    ConfirmDialog,
    Toast,
    DatePipe
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  loading: boolean = false;
  constructor(
    private userService: UsersService,
    private cs: ConfirmationService,
    private messageService: MessageService,) {
  }
  ngOnInit() {
    this.loadUsersList();
  }

  loadUsersList(){
    this.loading = true;
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data;
      this.loading = false;
    });
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
        this.userService.toggleStatus(agence.uuid).subscribe({
          next: () => {
            this.loadUsersList();
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Statut changé" });
          },
          error: (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }
}
