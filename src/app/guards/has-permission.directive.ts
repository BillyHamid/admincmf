import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private requiredPermissions: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService // Injection du service AuthService
  ) { }

  @Input()
  set appHasPermission(permissions: string[]) {
    this.requiredPermissions = permissions;
    this.updateView();
  }

  @Input()
  set appHasNotPermission(permissions: string[]) {
    this.requiredPermissions = permissions;
    this.updateHasNotView();
  }

  ngOnInit(): void {
    const tokenData = this.authService.getTokenData();

  }

  private updateView() {
    const tokenData = this.authService.getTokenData();
    // Le JWT peut avoir "permissions" (array) ou format alternatif
    let userPermissions: string[] = [];
    if (tokenData?.permissions) {
      userPermissions = Array.isArray(tokenData.permissions) ? tokenData.permissions : [];
    }
    // En démo : si l'utilisateur est authentifié mais sans permissions, afficher quand même (admin)
    const isAuthenticated = this.authService.isAuthenticated();
    const hasNoPermissions = userPermissions.length === 0;
    const hasRequiredPermission = this.requiredPermissions.length === 0 ||
      this.requiredPermissions.every(permission => userPermissions.includes(permission));

    if (hasRequiredPermission || (isAuthenticated && hasNoPermissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private updateHasNotView() {
    const tokenData = this.authService.getTokenData();
    console.log('tokenData', tokenData);
    const userPermissions = tokenData?.permissions || [];

    if (this.requiredPermissions.every(permission => !userPermissions.includes(permission))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
