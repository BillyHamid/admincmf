import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from "primeng/inputtext";
import {ButtonDirective} from "primeng/button";
import {NgIf} from "@angular/common";
import {UsersService} from "../../services/users.service";
import {environment} from "../../../environements/environement.production";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    ButtonDirective,
    NgIf
  ],
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any = null;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UsersService) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const session = localStorage.getItem(environment.sessionKey);
    if (session) {
      try {
        const raw = JSON.parse(session); // renvoie encore une string
        this.user = typeof raw === 'string' ? JSON.parse(raw) : raw;
        console.log('Profil chargé:', this.user);
      } catch (e) {
        console.error('Erreur de parsing du profil', e);
      }
    }
  }

  updatePassword() {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      oldPassword: currentPassword,
      newPassword: newPassword
    };

    this.userService.changePassword(payload).subscribe({
      next: () => {
        alert('Mot de passe modifié avec succès');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors du changement de mot de passe : ', err);
        alert('Erreur : vérifiez vos informations ' + err?.error.message);
      }
    });
  }
}
