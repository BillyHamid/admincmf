import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {HttpClientModule} from "@angular/common/http";

@Component({
    selector: 'app-app-layout',
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
  ],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

  darkMode = false;

  isSidebarOpen = true;


}
