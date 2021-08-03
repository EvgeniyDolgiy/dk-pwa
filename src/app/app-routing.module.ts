import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { MenuListComponent } from './modules/menu/components/menu-list/menu-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'news/like', pathMatch: 'full' },
  { path: 'news', redirectTo: 'news/like', pathMatch: 'full' },
  { path: 'news/:type', loadChildren: () => import('./modules/news/news.module').then(m => m.NewsModule) },
  { path: 'error/:type', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule) },
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
