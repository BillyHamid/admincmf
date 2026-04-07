import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from "@angular/common";
import { ProgressSpinner } from "primeng/progressspinner";
import { ButtonDirective } from "primeng/button";
import { ClientService } from "../../../services/client.service";
import {Tag} from "primeng/tag";

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgForOf,
    NgClass,
    DatePipe,
    ProgressSpinner,
    ButtonDirective,
    Tag
  ]
})
export class ClientDetailsComponent implements OnChanges {
  @Input() client: any;
  @Input() type: 'physique' | 'moral' | 'association' = 'physique';
  @Input() pieces: any[] = [];
  @Input() loading = false;

  clientPieces: any[] = [];
  pieceLoading = false;
  fileLoading = false;

  constructor(private clientService: ClientService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client'] && this.client?.id) {
      this.getClientPiecesJusticatif();
    }
  }

  getClientPiecesJusticatif() {
    this.clientPieces = [];
    this.pieceLoading = true;
    this.clientService.getClientPiecesJusticatif(this.client?.id).subscribe({
      next: (data: any) => {
        this.clientPieces = data;
        this.pieceLoading = false;
      },
      error: () => {
        this.pieceLoading = false;
      }
    });
  }

  getFileExtension(url: string): string {
    return url?.split('.').pop()?.toLowerCase() || '';
  }

  visualiserPiece(url: string): void {
    this.fileLoading = true;
    this.clientService.downLoadPiece(url).subscribe({
      next: response => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('content-disposition') || '';
        const isInline = contentDisposition.includes('inline');
        const matches = /filename="(.+)"/.exec(contentDisposition);
        const filename = matches?.[1] || 'document';
        this.fileLoading = false;

        const objectUrl = window.URL.createObjectURL(blob);

        if (isInline) {
          window.open(objectUrl, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = filename;
          link.click();
        }
      },
      error: () => {
        this.fileLoading = false;
        alert('Erreur lors de la récupération du fichier');
      }
    });
  }

  protected readonly window = window;
}
