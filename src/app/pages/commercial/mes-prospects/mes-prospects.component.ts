import { Component, OnInit } from '@angular/core';
import { CommercialService } from '../../../services/commercial.service';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DatePipe, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'app-mes-prospects',
  standalone: true,
  imports: [TableModule, ButtonDirective, Tag, DatePipe, NgIf, PrimeTemplate, RouterLink],
  templateUrl: './mes-prospects.component.html',
  styleUrl: './mes-prospects.component.scss'
})
export class MesProspectsComponent implements OnInit {
  prospects: any[] = [];
  loading = false;

  constructor(
    private commercialService: CommercialService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProspects();
  }

  loadProspects() {
    this.loading = true;
    this.commercialService.getMyProspects().subscribe({
      next: (data) => {
        this.prospects = data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getProspectName(d: any): string {
    const p = d?.prospectClient;
    if (!p) return '-';
    if (p.nom) return `${p.nom} ${p.prenom || ''}`.trim();
    if (p.raisonSociale) return p.raisonSociale;
    if (p.nomOrganisation) return p.nomOrganisation;
    return '-';
  }

  viewDetail(d: any) {
    this.router.navigate(['/commercial/prospects', d.uuid]);
  }
}
