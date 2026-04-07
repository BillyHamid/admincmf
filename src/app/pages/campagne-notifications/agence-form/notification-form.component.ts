import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import {Button, ButtonDirective} from 'primeng/button';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import {CampagneService} from "../../../services/notification.service";
import {InputTextarea} from "primeng/inputtextarea";
import {Checkbox} from "primeng/checkbox";
import {InputText} from "primeng/inputtext";
import {Calendar} from "primeng/calendar";
import {InputSwitch} from "primeng/inputswitch";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    Button,
    Select,
    Toast,
    ButtonDirective,
    InputTextarea,
    Checkbox,
    InputText,
    Calendar,
    InputSwitch,
    NgIf
  ],
  providers: [MessageService],
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss'
})
export class NotificationFormComponent {
  visible: boolean = false;
  processing: boolean = false;

  @Output() onDone = new EventEmitter<any>();

  notificationForm = this.fb.group({
    titre: ['', [Validators.required]],
    message: ['', [Validators.required]],
    cible: ['TOUS_UTILISATEURS', [Validators.required]],
    programmee: [false],
    dateEnvoi: [null],
  });

  constructor(
    private fb: FormBuilder,
    private notificationService: CampagneService,
    private messageService: MessageService
  ) {}

  showDialog() {
    this.visible = true;
  }

  saveForm() {
    this.processing = true;
    this.notificationService.sendNotification(this.notificationForm.value).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Notification envoyée" });
        this.processing = false;
        this.visible = false;
        this.onDone.emit(response);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Échec de l'envoi" });
        this.processing = false;
        this.visible = false;
        this.onDone.emit(error);
      }
    });
  }
}
