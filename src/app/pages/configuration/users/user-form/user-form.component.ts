import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {RolesService} from "../../../../services/roles.service";
import {MultiSelect} from "primeng/multiselect";
import {DropdownModule} from "primeng/dropdown";
import {UsersService} from "../../../../services/users.service";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {Toast} from "primeng/toast";

@Component({
  selector: 'app-user-form',
  imports: [
    PrimeTemplate,
    TableModule,
    ButtonDirective,
    Dialog,
    Button,
    ReactiveFormsModule,
    DropdownModule,
    Toast,
    NgIf,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  visible: boolean = false;
  processing: boolean = false;
  agences: any = [];
  roles: any = [];
  userForm = this.fb.group({
    lastname: ['',[Validators.required]],
    firstname: ['',[Validators.required]],
    email: ['',[Validators.required]],
    agence: ['',[Validators.required]],
    phone: ['',[Validators.required]],
    roleId: ['',[Validators.required]],


  });
  @Output() onDone = new EventEmitter<any>();
  @Input() mode: 'edit' | 'create' = 'create';
  @Input() target: any;
  constructor(
    private fb: FormBuilder,
    private agenceService: AgencesService,
    private roleService: RolesService,
    private usersService: UsersService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllAgences();
    this.getAllRoles();
  }

  showDialog() {
    this.visible = true;
    console.log(this.target)
    if (this.mode === 'edit' && this.target) {
      this.userForm.patchValue({
        firstname: this.target.agent.firstname,
        agence: this.target.agent.agence,
        phone: this.target.agent.phone,
        email: this.target.agent.email,
        lastname: this.target.agent.lastname,
        roleId: this.target.role
      })
    }
  }

  saveForm() {
    this.processing = true;
    let data = this.userForm.value as any;
    data.role = data.roleId?.code;
    data.username = data.email;
    data.agenceId = data.agence?.uuid;
    console.log(this.userForm.value)

    if (this.mode === 'create') {
      this.usersService.saveUser(data).subscribe((data => {
        this.processing = false;
        this.visible = false;
        this.userForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Utilisateur mise à jour" });
        this.onDone.emit(data);
      }))
    } else{
      this.usersService.updateUser(this.target?.uuid, data).subscribe((data => {
        this.processing = false;
        this.visible = false;
        this.userForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Succès !', detail: "Utilisateur mise à jour" });
        this.onDone.emit(data);
      }))
    }
  }

  getAllAgences(){
    this.agenceService.getAllAgences().subscribe((data => {
      this.agences = data
    }))
  }

  getAllRoles(){
    this.roleService.getAllRoles().subscribe((data => {
      this.roles = data
    }))
  }


}
