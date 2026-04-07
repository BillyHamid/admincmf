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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AgencesService} from "../../../../services/agences.service";
import {MessageService} from "primeng/api";
import {Toast} from "primeng/toast";
import {UsersService} from "../../../../services/users.service";
import {DropdownModule} from "primeng/dropdown";
import {FaqService} from "../../../../services/faq.service";
import {ServicesService} from "../../../../services/services.service";

@Component({
  selector: 'app-service-form',
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
  templateUrl: './services-form.component.html',
  styleUrl: './services-form.component.scss'
})
export class ServicesFormComponent implements OnInit {

  @Input() forEdit = false
  @Input() target: any
  @Output() onDone = new EventEmitter()
  faqForm!: FormGroup
  visible = false
  processing = false
  constructor(
    private fb: FormBuilder,
    private agenceService: AgencesService,
    private messageService: MessageService,
    private userService: UsersService,
    private faqService: ServicesService
  ) {}

  ngOnInit() {
    this.faqForm = this.fb.group({
      code: ['', Validators.required],
      libelleService: ['', Validators.required],
      descriptionService: ['', Validators.required]
    })
  }

  showDialog() {
    this.visible = true
    if (this.forEdit && this.target) {
      this.faqForm.patchValue(this.target)
    } else {
      this.faqForm.reset()
    }
  }

  saveForm() {
    if (this.faqForm.invalid) return
    this.processing = true
    const call = this.forEdit
      ? this.faqService.update(this.target.id, this.faqForm.value)
      : this.faqService.create(this.faqForm.value)

    call.subscribe({
      next: () => {
        this.visible = false
        this.onDone.emit()
      },
      complete: () => this.processing = false
    })

  }
}
