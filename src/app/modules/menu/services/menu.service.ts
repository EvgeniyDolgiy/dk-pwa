import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';

import { IMenuItem } from '../interfaces/menu.interface';
import { NEWS_TYPE } from '../../../interfaces/app.enum';

import { NewsService } from '../../news/services/news.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly selectedMenuItemSubject: BehaviorSubject<IMenuItem | null>;
  private readonly menuListItemSubject: BehaviorSubject<IMenuItem[]>;

  public get menuList(): Observable<IMenuItem[]> {
    return this.menuListItemSubject.asObservable();
  }

  public get selectedMenuItem(): Observable<IMenuItem | null> {
    return this.selectedMenuItemSubject.asObservable();
  }

  constructor(
    private location: Location,
    private newsService: NewsService
  ) {
    this.selectedMenuItemSubject = new BehaviorSubject (null);
    this.menuListItemSubject = new BehaviorSubject ([
      {
        id: 'everything',
        title: 'Everything',
        index: 1,
        link: NEWS_TYPE.EVERYTHING
      },
      {
        id: 'topHeadlines',
        title: 'Top Headlines',
        index: 2,
        link: NEWS_TYPE.TOP_HEADLINES
      },
      {
        id: 'like',
        title: 'Liked',
        index: 3,
        link: NEWS_TYPE.LIKE
      }
    ]);

    location.onUrlChange((url) => {
      this.setSelectedMenuItemByUrl(url);
    });
  }

  private setSelectedMenuItemByUrl(url: string): void {
    const menuList = this.menuListItemSubject.getValue();

    for (const menuItem of menuList) {
      if (url.indexOf(`/news/${menuItem.link}`) > -1) {
        this.selectedMenuItemSubject.next(menuItem);
        break;
      }
    }
  }

  public setSelectedMenuItem(item?: IMenuItem): void {
    this.newsService.clearNews();
  }
}
