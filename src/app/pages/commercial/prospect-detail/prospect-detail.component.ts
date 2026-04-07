import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommercialService } from '../../../services/commercial.service';
import { ClientService } from '../../../services/client.service';
import { ButtonDirective } from 'primeng/button';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-prospect-detail',
  standalone: true,
  imports: [ButtonDirective, DatePipe, NgForOf, NgIf, Tag, RouterLink],
  templateUrl: './prospect-detail.component.html',
  styleUrl: './prospect-detail.component.scss'
})
export class ProspectDetailComponent implements OnInit {
  prospect: any = null;
  dossierId = '';
  loading = false;
  fileLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commercialService: CommercialService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dossierId = params['id'];
      if (this.dossierId) this.loadDetail();
    });
  }

  loadDetail() {
    this.loading = true;
    this.commercialService.getProspectDetail(this.dossierId).subscribe({
      next: (data) => {
        this.prospect = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  visualiserPiece(url: string) {
    this.fileLoading = true;
    this.clientService.downLoadPiece(url).subscribe({
      next: (response: any) => {
        const blob = response.body;
        const contentDisposition = response.headers?.get('content-disposition') || '';
        const matches = /filename="(.+)"/.exec(contentDisposition);
        const filename = matches?.[1] || 'document';
        this.fileLoading = false;
        const urlObj = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlObj;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(urlObj);
      },
      error: () => {
        this.fileLoading = false;
      }
    });
  }

  isPhysique(): boolean {
    return this.prospect && !this.prospect?.numIfu && !this.prospect?.nomOrganisation;
  }

  isMoral(): boolean {
    return this.prospect?.numIfu != null;
  }

  isAssociation(): boolean {
    return this.prospect?.nomOrganisation != null;
  }
}
