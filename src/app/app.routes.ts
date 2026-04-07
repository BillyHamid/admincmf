import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Routes} from '@angular/router';
import {AppLayoutComponent} from "./layouts/app-layout/app-layout.component";
import {AuthGuard} from "./guards/auth.guard";
import {ResetPassComponent} from "./pages/reset-pass/reset-pass.component";

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'simulateur-credit',
        loadComponent: () => import('./pages/simulateur-credit/simulateur-credit.component').then(m => m.SimulateurCreditComponent),
      },
      {
        path: 'campagne/notifications',
        loadComponent: () => import('./pages/campagne-notifications/campagne-notifications.component').then(m => m.CampagneNotificationsComponent),
      },
      {
        path: 'client/releve-requests',
        loadComponent: () => import('./pages/releve-requests/releve-request.component').then(m => m.ReleveRequestComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent),
        children: [
          { path: '', redirectTo: 'physique', pathMatch: 'full' },
          {
            path: 'physique',
            loadComponent: () => import('./pages/clients/physique/physique.component').then(m => m.PhysiqueComponent),
          },
          {
            path: 'morale',
            loadComponent: () => import('./pages/clients/morale/morale.component').then(m => m.MoralComponent),
          },
          {
            path: 'associations',
            loadComponent: () => import('./pages/clients/associations/associations.component').then(m => m.AssociationComponent),
          }

        ]
      },
      {
        path: 'dossiers-clients',
        loadComponent: () => import('./pages/dossiers-clients/dossier-clients.component').then(m => m.DossierClientsComponent),
        children: [
          {
            path: ':dossierId/details/:clientId',
            loadComponent: () => import('./pages/dossiers-clients/details/details.component').then(m => m.DetailsComponent),
          }
        ]
      },
      {
        path: 'configurations/documents',
        loadComponent: () => import('./pages/configuration/basic/document-requis.component').then(m => m.DocumentRequisComponent)
      },
      {
        path: 'configurations/users',
        loadComponent: () => import('./pages/configuration/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'configurations/agences',
        loadComponent: () => import('./pages/configuration/agences/agences.component').then(m => m.AgencesComponent),
      },
      {
        path: 'configurations/faq',
        loadComponent: () => import('./pages/configuration/faq/faq.component').then(m => m.FaqComponent),
      },
      {
        path: 'configurations/services',
        loadComponent: () => import('./pages/configuration/services/services.component').then(m => m.ServicesComponent),
      },
      {
        path: 'configurations/profil',
        loadComponent: () => import('./pages/profil/profil.component').then(m => m.ProfilComponent),
      },
      {
        path: 'configurations/roles-permissions',
        loadComponent: () => import('./pages/configuration/roles-permissions/roles-permissions.component').then(m => m.RolesPermissionsComponent),
      },
      {
        path: 'commercial',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () => import('./pages/commercial/commercial-dashboard/commercial-dashboard.component').then(m => m.CommercialDashboardComponent),
          },
          {
            path: 'prospects',
            loadComponent: () => import('./pages/commercial/mes-prospects/mes-prospects.component').then(m => m.MesProspectsComponent),
          },
          {
            path: 'nouveau-prospect',
            loadComponent: () => import('./pages/commercial/nouveau-prospect/nouveau-prospect.component').then(m => m.NouveauProspectComponent),
          },
          {
            path: 'prospects/:id',
            loadComponent: () => import('./pages/commercial/prospect-detail/prospect-detail.component').then(m => m.ProspectDetailComponent),
          },
        ]
      }
    ],
    // canActivate: [AuthGuard]
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./pages/reset-pass/reset-pass.component').then(m => m.ResetPassComponent)
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
