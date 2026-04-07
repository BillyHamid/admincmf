// accordion.component.ts
import {Component, Input, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AdoukMenu} from "../services/menu.service";
import {NgClass} from "@angular/common";
import {fa0} from "@fortawesome/free-solid-svg-icons";
import {HasPermissionDirective} from "../guards/has-permission.directive";


@Component({
  selector: 'app-accordion-menu',
  standalone: true,
  template: `
    <div class="accordion">
      <div class="accordion-item">

        <div
          class="accordion-header"
          [class.active]="isOpen">
          {{ menuItem?.title }}
        </div>
        <div
          class="accordion-content"
          [@expandCollapse]="'expanded'"
          (@expandCollapse.done)="onAnimationEnd($event)">
          <ul>
            @for (menu of menuItem?.children; track $index) {
              @if (menu.permission !== undefined) {
                <li class="flex items-center" *appHasPermission="[menu?.permission]"
                    [ngClass]="{'item-active ': isActive(menu.routerLink), 'text-gray-700': !isActive(menu.routerLink)}">
                  <a
                    class="flex items-center p-3"
                    [routerLink]="menu.routerLink" routerLinkActive="active"
                    [routerLinkActiveOptions]="{exact: menu.exact ?? false}">
                    <fa-icon class="ml-3" [icon]="menu.icon"></fa-icon>
                    <p class="ml-3 text-sm">{{ menu.title }}</p>
                    <p class="ml-3 text-md">{{ menu.count }}</p>
                  </a>
                </li>
              } @else {
                <li class="flex items-center"
                    [ngClass]="{'item-active ': isActive(menu.routerLink), 'text-gray-700': !isActive(menu.routerLink)}">
                  <a
                    class="flex items-center p-3"
                    [routerLink]="menu.routerLink" routerLinkActive="active"
                    [routerLinkActiveOptions]="{exact: menu.exact ?? false}">
                    <fa-icon class="ml-3" [icon]="menu.icon"></fa-icon>
                    <p class="ml-3 text-sm">{{ menu.title }}</p>
                  </a>
                </li>
              }
            }
          </ul>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .accordion {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .accordion-header {
      padding: 10px 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;
      opacity: 0.4;
      gap: 15px;
      text-decoration: none;
      position: relative;
      transition: 600ms;
      background: transparent;
    }

    .item-active {
      background-color: rgba(227, 6, 19, 0.12);
      color: #002855;
      font-weight: bold;
      transition: 0.3s;
    }


    .accordion-header:hover {
    }

    .accordion-header.active {
    }

    .accordion-content {
      background: #ffffff;
    }

    .arrow {
      font-size: 12px;
    }
  `],
  imports: [
    FaIconComponent,
    RouterLinkActive,
    RouterLink,
    NgClass,
    HasPermissionDirective,
  ],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        padding: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        paddingBlock: '*'
      })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-out')
      ])
    ]),
    trigger('rotateArrow', [
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      state('open', style({
        transform: 'rotate(180deg)'
      })),
      transition('closed <=> open', [
        animate('200ms')
      ])
    ])
  ]
})
export class AccordionComponent implements OnInit {

  @Input()
  menuItem: AdoukMenu | undefined;
  @Input() isOpen = true;

  onAnimationEnd(event: any) {
    // Optional: Handle animation completion
  }

  toggleItem() {
    this.isOpen = !this.isOpen;
  }

  constructor(private router: Router) {
  }
  isActive(route: any): boolean {
    return this.router.isActive(route, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }


  ngOnInit(): void {

    this.isOpen = this.menuItem?.children?.findIndex(el => el.routerLink == this.router.url) != -1

    this.router.events.subscribe({
      next: (data: any) => {
        if (data instanceof NavigationEnd){
          this.isOpen = this.menuItem?.children?.findIndex(el => el.routerLink == data.url) != -1
        }
      }
    });
  }

  protected readonly fa0 = fa0;
}
