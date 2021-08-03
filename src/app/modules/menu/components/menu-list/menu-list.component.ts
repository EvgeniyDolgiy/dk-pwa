import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuService } from '../../services/menu.service';
import { IMenuItem } from '../../interfaces/menu.interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit, OnDestroy {
  menuList: IMenuItem[] = [];
  selectedMenuItem: IMenuItem | null;

  private subscriptions: Subscription[];

  constructor(
    private menuService: MenuService,
    private titleService: Title
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    const selectedMenuItemSubscription$ = this.menuService.selectedMenuItem.subscribe((data) => {
      this.selectedMenuItem = data;
      if (this.selectedMenuItem !== null) {
        this.setTitle(this.selectedMenuItem.title);
      }
    });

    const menuListSubscription$ = this.menuService.menuList.subscribe((data) => {
      this.menuList = data.map((item: IMenuItem) => (Object.assign({}, item)));
    });

    this.subscriptions.push(
      selectedMenuItemSubscription$,
      menuListSubscription$
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }

  private setTitle(newTitle: string): void {
    this.titleService.setTitle(`PWA NEWS - ${newTitle}`);
  }

  public selectMenuItem(item: IMenuItem): void {
    this.menuService.setSelectedMenuItem(item);
  }

  public checkSelectedMenu(menuItemId: IMenuItem['id']): boolean {
    return (this.selectedMenuItem && this.selectedMenuItem.id === menuItemId) ? true : false;
  }

}
