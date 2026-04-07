import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ClientService} from "../../services/client.service";
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ProgressSpinner} from "primeng/progressspinner";

@Component({
  selector: 'app-dossiers-clients',
  standalone: true,
  templateUrl: './dossier-clients.component.html',
  imports: [
    RouterLink,
    RouterOutlet,
    NgForOf,
    DatePipe,
    RouterLinkActive,
    NgClass,
    NgIf,
    NgOptimizedImage,
    ProgressSpinner
  ],
  styleUrl: './dossier-clients.component.scss'
})
export class DossierClientsComponent implements OnInit {

  dossiers: any = [];
  loading: boolean = false;
  constructor(
    private clientService: ClientService,
  ) {}

  ngOnInit(){
    this.getAllDossiers()
  }

  getAllDossiers(){
    this.loading = true
    this.clientService.getDossier().subscribe((response) => {
      this.dossiers = response
      this.loading = false
    })
  }


}
