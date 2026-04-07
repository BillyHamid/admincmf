import { Injectable } from '@angular/core';
import {
  faBox,
  faBuilding,
  faBullhorn,
  faCalculator,
  faChartLine,
  faDashboard,
  faFile,
  faFolder,
  faFolderPlus,
  faList,
  faQuestion,
  faUser,
  faUserCheck,
  faUserGroup,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import {ClientService} from "./client.service";

export interface AdoukMenu{
  exact?: boolean;
  title: string;
  enabled?: boolean;
  icon?: any;
  routerLink?: string;
  children?: AdoukMenu[];
  permission?: any,
  count?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private clientService: ClientService) {
    // Initialiser le menu immédiatement pour éviter une sidebar vide
    this.buildMenu(0);
    this.clientService.getDossier().subscribe({ error: () => {} });
    this.clientService.dossierCount.subscribe((count) => {
      this.buildMenu(count ?? 0);
    });
  }


  buildMenu(dossierCount?: number | 0 | null){
    this.mainMenu = [
      {
        title: "Menu",
        children: [
          {
            title: "Tableau de bord",
            icon: faDashboard,
            permission: 'view_dashboard',
            routerLink: "/dashboard",
          },
          {
            title: "Dossiers en attente",
            icon: faFolder,
            routerLink: "/dossiers-clients",
            permission: 'view_client_dossier',
            count: dossierCount

          },
          {
            title: "Clients",
            icon: faUsers,
            routerLink: "/clients",
            permission: 'view_client',
          },
          {
            title: "Demandes de rélevés",
            icon: faFile,
            routerLink: "/client/releve-requests",
            permission: 'view_client_releve',
          },
          {
            title: "Campagnes notifications",
            icon: faBullhorn,
            routerLink: "/campagne/notifications",
            permission: 'view_notification',
          },
          {
            title: "Simulateur de crédit",
            icon: faCalculator,
            routerLink: "/simulateur-credit",
          },
        ]
      },
      {
        title: "Prospection",
        children: [
          {
            title: "Tableau de bord commercial",
            icon: faChartLine,
            routerLink: "/commercial/dashboard",
            permission: 'view_commercial_dashboard',
          },
          {
            title: "Mes prospects",
            icon: faList,
            routerLink: "/commercial/prospects",
            permission: 'view_my_prospects',
          },
          {
            title: "Nouveau prospect",
            icon: faFolderPlus,
            routerLink: "/commercial/nouveau-prospect",
            permission: 'create_prospect',
          },
        ]
      },
      {
        title: "Configurations",
        children: [
          {
            title: "Documents requis",
            icon: faFolder,
            routerLink: "/configurations/documents",
            permission: 'view_piece_justificative',
          },
          {
            title: "Foir à questions",
            icon: faQuestion,
            routerLink: "/configurations/faq",
            permission: 'view_faq',
          },
          {
            title: "Services",
            icon: faBox,
            routerLink: "/configurations/services",
            permission: 'view_service',
          },
          {
            title: "Utilisateurs / Agents",
            icon: faUserGroup,
            routerLink: "/configurations/users",
            permission: 'view_user',
          },
          {
            title: "Roles et permissions",
            icon: faUserCheck,
            routerLink: "/configurations/roles-permissions",
            permission: 'view_role',
          },
          {
            title: "Agences",
            icon: faBuilding,
            routerLink: "/configurations/agences",
            permission: 'view_agence',

          },
          {
            title: "Mon profil",
            icon: faUser,
            routerLink: "/configurations/profil",

          },
        ]
      },

    ];




  }

  public mainMenu: AdoukMenu[] = []
}

