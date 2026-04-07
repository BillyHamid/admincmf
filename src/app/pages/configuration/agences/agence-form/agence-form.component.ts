import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tab, TabList, Tabs} from "primeng/tabs";
import {RouterLink, RouterOutlet} from "@angular/router";
import {TableModule} from "primeng/table";
import {NgClass, NgIf} from "@angular/common";
import {Badge} from "primeng/badge";
import {Button, ButtonDirective} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AgencesService} from "../../../../services/agences.service";
import {MessageService} from "primeng/api";
import {Toast} from "primeng/toast";
import {UsersService} from "../../../../services/users.service";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-agence-form',
  imports: [
    TableModule,
    ButtonDirective,
    Dialog,
    Button,
    Select,
    ReactiveFormsModule,
    Toast,
    DropdownModule,
    NgIf,
  ],
  providers: [MessageService],
  templateUrl: './agence-form.component.html',
  styleUrl: './agence-form.component.scss'
})
export class AgenceFormComponent {

  visible: boolean = false;
  processing: boolean = false;
  agents: any = [];
  agenceForm = this.fb.group({
    agencyName: ['',[Validators.required]],
    agencyAdress: ['',[Validators.required]],
    agencyPhone1: ['',[Validators.required]],
    agencyPhone2: [''],
    gestionnaireId: [''],
    agencyLongitude: ['',[Validators.required]],
    agencyLatitude: ['',[Validators.required]],
  });
  @Output() onDone = new EventEmitter<any>();
  @Input() forEdit: boolean = false;
  @Input() target: any;
  constructor(
    private fb: FormBuilder,
    private agenceService: AgencesService,
    private messageService: MessageService,
    private userService: UsersService
  ) {}

  showDialog() {
    this.visible = true;
    this.getAllAgents();

    if (this.forEdit && this.target) {
      this.agenceForm.patchValue({
        agencyName: this.target.agencyName,
        agencyAdress: this.target.agencyAdress,
        agencyPhone1: this.target.agencyPhone1,
        agencyPhone2: this.target.agencyPhone2,
        agencyLongitude: this.target.agencyLongitude,
        agencyLatitude: this.target.agencyLatitude,
        gestionnaireId: this.target.gestionnaire?.uuid || ''
      });
    }
  }


  saveForm() {
    this.processing = true;
    const formValue = this.agenceForm.value;

    const saveObservable = this.forEdit && this.target?.uuid
      ? this.agenceService.updateAgence(this.target.uuid, formValue)
      : this.agenceService.saveAgence(formValue);

    saveObservable.subscribe({
      next: (response: any) => {
        this.processing = false;
        this.visible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: this.forEdit ? 'Agence modifiée' : 'Agence enregistrée'
        });
        this.onDone.emit(response);
      },
      error: (error: any) => {
        console.error(error);
        this.processing = false;
        this.visible = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'opération' });
        this.onDone.emit(error);
      }
    });
  }


  getAllAgents(){
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        this.agents = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

}
