import { Component } from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonDirective} from "primeng/button";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {environment} from "../../../environements/environement";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {Toast} from "primeng/toast";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonDirective,
    ReactiveFormsModule,
    HttpClientModule,
    NgOptimizedImage,
    Toast
  ],
  providers: [AuthService, ToastrService, MessageService, HttpClient ],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.scss'
})
export class ResetPassComponent {

  year = new Date().getFullYear();
  authForm: FormGroup;
  processing: boolean = false;
  displayLoginForm: boolean = false;

  constructor(private fb: FormBuilder,private messageService: MessageService, private toastr: ToastrService, private router: Router, private as: AuthService) {
    this.authForm = fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

  handleLogin() {

    this.processing = true;
    this.as.resetPass(this.authForm.value.username).subscribe({
      next: (res: any) => {
        this.processing = false;
        this.messageService.add({ severity: 'success', summary: 'Reset de password réussi', detail: "Un mail vous sera envoyé avec votre nouveau mot de passe" });
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.processing = false;
        this.messageService.add({ severity: 'error', summary: 'Échec de connexion !', detail: err.error.message });
      }
    });

  }
}
