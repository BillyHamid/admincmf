import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {UserFormComponent} from "../users/user-form/user-form.component";
import {AgencesService} from "../../../services/agences.service";
import {RolesPermissionsFormComponent} from "./agence-form/roles-permissions-form.component";
import {Button, ButtonDirective} from "primeng/button";
import {ToggleSwitch} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";
import {RolesService} from "../../../services/roles.service";
import {Tree, TreeModule} from "primeng/tree";
import {Tag} from "primeng/tag";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";

@Component({
  selector: 'app-roles-permissions',
  imports: [
    NgOptimizedImage,
    PrimeTemplate,
    TableModule,
    RolesPermissionsFormComponent,
    FormsModule,
    Tag,
    NgForOf,
    ButtonDirective,
    ConfirmDialog,
    Toast
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './roles-permissions.component.html',
  styleUrl: './roles-permissions.component.scss'
})
export class RolesPermissionsComponent implements OnInit {
  roles!: any[];
  loading: boolean = false;
  permissions!: any[];
  constructor(private rolesService: RolesService,
              private cs: ConfirmationService,
              private messageService: MessageService,) {
  }

  ngOnInit() {
    this.loadRoleList();
  }

  loadRoleList(){
    this.loading = true;
    this.rolesService.getAllRoles().subscribe((data: any) => {
      this.roles = data;
      this.loading = false;
    });
  }

  handleDelete(role: any) {
    this.cs.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous vraiment supprimer ce role ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-danger outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm mr-2',
      accept: () => {
        this.rolesService.deleteRole(role.id).subscribe({
          next: () => {
            this.loadRoleList();
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Role enregistré" });
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }




}
