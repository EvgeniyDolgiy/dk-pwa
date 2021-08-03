import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from './../../app-routing.module';

import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';


@NgModule({
  declarations: [MenuListComponent, MenuItemComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatListModule
  ],
  exports: [MenuListComponent],
})

export class MenuModule { }
