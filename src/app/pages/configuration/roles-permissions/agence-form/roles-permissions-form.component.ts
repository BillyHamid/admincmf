import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RolesService } from '../../../../services/roles.service';

import { TableModule } from 'primeng/table';
import { Button, ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-roles-permissions-form',
  templateUrl: './roles-permissions-form.component.html',
  styleUrl: './roles-permissions-form.component.scss',
  imports: [
    TableModule,
    ButtonDirective,
    Dialog,
    Button,
    ReactiveFormsModule,
    Toast,
    DropdownModule,
    MultiSelect,
    NgIf,
  ],
  providers: [MessageService],
})
export class RolesPermissionsFormComponent implements OnInit {
  @Input() mode: 'edit' | 'create' = 'create';
  @Input() target: any;

  @Output() onDone = new EventEmitter<any>();

  visible = false;
  processing = false;
  permissions: any[] = [];

  roleForm = this.fb.group({
    label: ['', Validators.required],
    permissions: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPermissionsList();
  }

  showDialog(): void {
    this.visible = true;

    if (this.mode === 'edit' && this.target) {
      this.roleForm.patchValue({
        label: this.target.label,
        permissions: this.target.permissions,
        description: this.target.description,
      });
    }
  }

  saveForm(): void {
    if (this.roleForm.invalid) return;

    this.processing = true;

    const formData = this.prepareFormData();

    const request$ = this.mode === 'create'
      ? this.roleService.saveRole(formData)
      : this.roleService.updateRole(this.target?.id, formData);

    request$.subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error),
    });
  }

  private prepareFormData() {
    const data = this.roleForm.value as any;
    return {
      ...data,
      code: data.label.trim().toLowerCase().replace(/\s+/g, '-'),
      permissionsId: data.permissions.map((p: any) => p.id),
    };
  }

  private handleSuccess(response: any): void {
    this.processing = false;
    this.visible = false;
    this.messageService.add({ severity: 'success', summary: 'Succès !', detail: this.mode === 'create' ? 'Rôle enregistré' : 'Rôle mis à jour' });
    this.onDone.emit(response);
    this.roleForm.reset();
  }

  private handleError(error: any): void {
    console.error(error);
    this.processing = false;
    this.visible = false;
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue.' });
    this.onDone.emit(error);
  }

  private loadPermissionsList(): void {
    this.roleService.getAllPermissions().subscribe({
      next: (data) => (this.permissions = data),
      error: (err) => console.error('Erreur lors du chargement des permissions', err),
    });
  }
}
