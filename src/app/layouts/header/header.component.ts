import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NgIf} from "@angular/common";
import {environment} from "../../../environements/environement";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";

@Component({
    selector: 'app-header',
  imports: [
    NgIf,
    ConfirmDialog,
    Toast,
  ],
  providers: [ConfirmationService, MessageService],

  templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: any = null;

  get isAuthenticated() { return this.as.isAuthenticated(); }

  constructor(private as: AuthService,
              private cs: ConfirmationService,
              private messageService: MessageService,) {
    this.loadUserFromStorage();
    this.as.user.subscribe(u => {
      if (u && (typeof u === 'object') && Object.keys(u).length > 0) {
        this.user = u;
      }
    });
  }

  private loadUserFromStorage() {
    const cache = localStorage.getItem(environment.sessionKey);
    if (cache !== null) {
      try {
        const parsed = JSON.parse(cache);
        this.user = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
      } catch {
        this.user = null;
      }
    }
  }

  logout() {
    this.cs.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Souhaitez-vous vraiment vous déconnecter ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-danger outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm mr-2',
      accept: () => {
        this.as.logout();
      }
    })
  }
}
