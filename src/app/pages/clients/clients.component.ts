import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {Router, RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-clients',
  imports: [
    NgForOf,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './clients.component.html',
  standalone: true,
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  stateOptions: any[] = [
    {"name" : "Clients physiques", "path": "physique"},
    {"name" : "Clients morale", "path": "morale"},
    {"name" : "Associations", "path": "associations"}
  ];
  value: string = 'Clients physiques';

  constructor(private router: Router) {
    this.router.navigate(['clients/physique']);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
