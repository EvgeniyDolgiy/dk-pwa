import { Component, Input, Output, EventEmitter } from '@angular/core';

import { IMenuItem } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  @Input() menuItem: IMenuItem;
  @Input() selected: boolean;
  @Output() selectMenu = new EventEmitter<IMenuItem>();

  constructor() { }

  menuItemClick(): void {
    if (!this.selected) {
      this.selectMenu.emit(this.menuItem);
    }
  }
}
