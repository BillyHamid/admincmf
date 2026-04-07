import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {UserFormComponent} from "../users/user-form/user-form.component";
import {AgencesService} from "../../../services/agences.service";
import {FaqFormComponent} from "./faq/faq-form.component";
import {Button, ButtonDirective} from "primeng/button";
import {ToggleSwitch} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Toast} from "primeng/toast";
import {Tag} from "primeng/tag";
import {FaqService} from "../../../services/faq.service";

@Component({
  selector: 'app-agences',
  imports: [
    NgOptimizedImage,
    PrimeTemplate,
    TableModule,
    FormsModule,
    ButtonDirective,
    ConfirmDialog,
    Toast,
    FaqFormComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
  faqList: any[] = []
  loading: boolean = false;

  constructor(
    private faqService: FaqService,
    private cs: ConfirmationService,
    private messageService: MessageService,) {
  }

  ngOnInit() {
    this.loadFaqList();
  }

  loadFaqList() {
    this.loading = true
    this.faqService.getAll().subscribe({
      next: data => this.faqList = data,
      complete: () => this.loading = false
    })
  }

  handleDelete(agence: any) {
    this.cs.confirm({
      icon: "pi pi-exclamation-triangle",
      message: "Confirmer la suppression ?",
      header: 'Confirmation',
      defaultFocus: 'reject',
      acceptLabel: 'Oui je confirme',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'p-button-danger outlined p-button-sm',
      rejectButtonStyleClass: 'p-button-sm mr-2',
      accept: () => {
        this.faqService.delete(agence.id).subscribe({
          next: () => {
            this.loadFaqList();
            this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Question supprimée avec succès" });
          },
          error: (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Erreur !', detail: error });
          }
        })
      }
    })
  }
}
