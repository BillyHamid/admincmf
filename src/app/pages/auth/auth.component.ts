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
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

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
    this.as.login(this.authForm.value).subscribe({
      next: (res: any) => {
        this.processing = false;
        // Saving auth data in local storage
        localStorage.setItem(environment.jwtKey, res.token);
        localStorage.setItem(environment.sessionKey, JSON.stringify(res.user));
        this.as.user.next(res.user);
        this.toastr.success('Connexion réussie','',{timeOut: 3000, progressBar: true});

        // Rediriger le commercial vers son dashboard
        const perms = this.as.getTokenData()?.permissions || [];
        const isCommercial = perms.includes('view_commercial_dashboard') && !perms.includes('view_user');
        const redirectUrl = sessionStorage.getItem('redirectUrl') || (isCommercial ? '/commercial/dashboard' : '/');
        sessionStorage.removeItem('redirectUrl');
        this.router.navigateByUrl(redirectUrl).then(r => {})
          .then(() => {
            this.toastr.info('Bienvenue sur Finacom','',{timeOut: 10000, progressBar: true});
          });
      },
      error: (err: any) => {
        this.processing = false;
        const msg = err?.error?.message || err?.message || (err?.status === 0 ? 'Serveur inaccessible. Vérifiez que le backend est démarré sur le port 8080.' : 'Erreur de connexion');
        this.messageService.add({ severity: 'error', summary: 'Échec de connexion !', detail: msg });
      }
    });

  }
}
