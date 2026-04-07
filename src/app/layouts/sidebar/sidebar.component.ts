import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconProp} from "@fortawesome/angular-fontawesome/types";
import {faCoffee, faFolderBlank, faHomeLg, faTable, faTools} from '@fortawesome/free-solid-svg-icons';
import {Avatar, AvatarModule} from "primeng/avatar";
import {IconField, IconFieldModule} from "primeng/iconfield";
import {OverlayBadgeModule} from "primeng/overlaybadge";
import {MenuService} from "../../services/menu.service";
import {AccordionComponent} from "../../components/accordion.menu";
import {environment} from "../../../environements/environement";
import {HasAuthorityDirective} from "../../guards/has-authority.directive";
import {HasPermissionDirective} from "../../guards/has-permission.directive";
import {AuthService} from "../../services/auth.service";


@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, FontAwesomeModule, AvatarModule, OverlayBadgeModule, AccordionComponent, RouterLinkActive, HasPermissionDirective],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isCollapsed = true;
  showLabel: string | null = null;
  user: any = null;

  constructor(
    private router: Router,
    protected menuService: MenuService,
    private authService: AuthService
  ) {
    this.loadUserFromStorage();
  }

  ngOnInit() {
    this.authService.user.subscribe(u => {
      if (u && Object.keys(u).length > 0) {
        this.user = u;
      }
    });
  }

  private loadUserFromStorage() {
    const cache = localStorage.getItem(environment.sessionKey);
    if (cache !== null) {
      try {
        const parsed = JSON.parse(cache);
        this.user = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
      } catch {
        this.user = null;
      }
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(route: any): boolean {
    return this.router.isActive(route, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }



  protected readonly faTable = faTable;
}
