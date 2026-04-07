import { Component, OnInit } from '@angular/core';
import { CommercialService } from '../../../services/commercial.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-commercial-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './commercial-dashboard.component.html',
  styleUrl: './commercial-dashboard.component.scss'
})
export class CommercialDashboardComponent implements OnInit {
  stats: { total: number; pending: number; validated: number; rejected: number } = {
    total: 0, pending: 0, validated: 0, rejected: 0
  };
  loading = false;

  constructor(private commercialService: CommercialService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.commercialService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
