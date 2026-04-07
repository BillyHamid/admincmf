import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./layouts/sidebar/sidebar.component";
import {HeaderComponent} from "./layouts/header/header.component";
import {HttpClientModule} from "@angular/common/http";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'finacomapp-frontend';
}
