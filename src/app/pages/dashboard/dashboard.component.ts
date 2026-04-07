import {Component, OnInit} from '@angular/core';
import {UIChart} from "primeng/chart";
import {StatsService} from "../../services/stats.service";
import {ProgressSpinner} from "primeng/progressspinner";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  imports: [
    UIChart,
    ProgressSpinner,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  dossierCount: any;
  dossierCountLoading: boolean = false;
  clientCount: any;
  clientCountLoading: boolean = false;

  constructor(private statService: StatsService) {
  }

  kycChartData: any;
  kycChartOptions: any;
  terminalChartData = {
    labels: [''],
    datasets: [{}]
  };

  chartOptions = {
    legend: {
      display: false
    },
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  ngOnInit() {

    this.getClientCountByType()
    this.kycChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#4B5563' // Gris foncé
          }
        }
      },
      maintainAspectRatio: false
    };
    this.getDossierCount();
    this.getClientCount();
    this.getClientCountByAgence();
  }


  getDossierCount() {
    this.dossierCountLoading = true;
    this.statService.getDossierCount().subscribe({
      next: (response: any) => {
        this.dossierCount = response;
        this.dossierCountLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du nombre de dossiers:', error);
      }
    });
  }

  getClientCount() {
    this.clientCountLoading = true;
    this.statService.getClientCount().subscribe({
      next: (response: any) => {
        this.clientCount = response;
        this.clientCountLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du nombre de clients:', error);
      }
    });
  }

  getClientCountByAgence() {
    this.statService.getAgenceCount().subscribe({
      next: (response: any[]) => {
        this.terminalChartData = {
          labels: response.map(r => r.agence),
          datasets: [
            {
              label: 'Nombre de clients ratachés',
              data: response.map(r => r.total),
              backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#e11d48', '#9333ea', '#14b8a6'],
              hoverBackgroundColor: ['#2563eb', '#059669', '#ea580c', '#be123c', '#7e22ce', '#0d9488']
            }
          ]
        };
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des clients par agence:', error);
      }
    });
  }

  getClientCountByType() {
    this.statService.getClientByTypeCount().subscribe({
      next: (response: any) => {
        this.kycChartData = {
          labels: ['Client physique', 'Entreprise', 'Associations'],
          datasets: [
            {
              data: [response.physic, response.entreprise, response.association],
              backgroundColor: ['#22c55e', '#facc15', '#3148d6'],
              hoverBackgroundColor: ['#16a34a', '#eab308', '#dc2626']
            }
          ]
        };
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du nombre de clients:', error);
      }
    });
  }

}
