import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';

import { NEWS_TYPE } from '../../../interfaces/app.enum';

import {
  INewsItem,
  NEWS_TYPE_OPTIONS,
  ILanguageDictionary,
  ICountryDictionary,
  ICategoryDictionary
} from '../interfaces/news.interface';
import { IResponseObject } from '../../../interfaces/http.interface';

import { HttpService } from '../../../services/http.service';
import { IndexDBService } from '../../../services/indexdb.service';
import { DialogService } from '../../dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly newsListItemSubject: BehaviorSubject<INewsItem[]>;
  private readonly newsLikeItemSubject: BehaviorSubject<string[]>;
  private readonly languageDictionarySubject: BehaviorSubject<ILanguageDictionary[]>;
  private readonly countryDictionarySubject: BehaviorSubject<ICountryDictionary[]>;
  private readonly categoryDictionarySubject: BehaviorSubject<ICategoryDictionary[]>;
  private readonly newsTypeSubject: BehaviorSubject<string>;

  public get languageDictionary(): Observable<ILanguageDictionary[]> {
    return this.languageDictionarySubject.asObservable();
  }

  public get countryDictionary(): Observable<ICountryDictionary[]> {
    return this.countryDictionarySubject.asObservable();
  }

  public get categoryDictionary(): Observable<ICategoryDictionary[]> {
    return this.categoryDictionarySubject.asObservable();
  }

  public get newsList(): Observable<INewsItem[]> {
    return this.newsListItemSubject.asObservable();
  }

  public get newsLikeList(): Observable<string[]> {
    return this.newsLikeItemSubject.asObservable();
  }

  public get newsType(): Observable<string> {
    return this.newsTypeSubject.asObservable();
  }

  public newsTypeOptions = {
    [NEWS_TYPE.EVERYTHING] : [
      NEWS_TYPE_OPTIONS.SEARCH,
      NEWS_TYPE_OPTIONS.RANGE,
      NEWS_TYPE_OPTIONS.LANGUAGE,
      NEWS_TYPE_OPTIONS.FIND
    ],
    [NEWS_TYPE.TOP_HEADLINES] : [
      NEWS_TYPE_OPTIONS.COUNTRY,
      NEWS_TYPE_OPTIONS.CATEGORY,
      NEWS_TYPE_OPTIONS.FIND
    ]
  };

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private indexDBService: IndexDBService,
    private dialogService: DialogService
  ) {
    this.newsListItemSubject = new BehaviorSubject([]);
    this.newsLikeItemSubject = new BehaviorSubject([]);
    this.languageDictionarySubject = new BehaviorSubject([]);
    this.countryDictionarySubject = new BehaviorSubject([]);
    this.categoryDictionarySubject = new BehaviorSubject([]);
    this.newsTypeSubject = new BehaviorSubject(null);

    this.getLanguageDictionary();
    this.getCountryDictionary();
    this.getCategoryDictionary();
    this.getAllLikedNewsIds();


    indexDBService.dataChanged('news').subscribe(() => {
      this.getAllLikedNewsIds();
      if (this.newsTypeSubject.getValue() === NEWS_TYPE.LIKE) {
        this.getAllLikedNews();
      }
    });
  }

  /**
   * 2-letter ISO-639-1 code of the language
   */
  private getLanguageDictionary(): void {
    this.languageDictionarySubject.next([
      { key: 'uk',
        name: 'Українська'
      },
      { key: 'en',
        name: 'English'
      },
      { key: 'de',
        name: '  Deutsch'
      },
      { key: 'fr',
        name: 'Français'
      }
    ]);
  }

  /**
   *  2-letter ISO 3166-1 code of the country
   */
  private getCountryDictionary(): void {
    this.countryDictionarySubject.next([
      { key: 'ua',
        name: 'Ukraine'
      },
      { key: 'gb',
        name: 'Great Britain'
      },
      { key: 'de',
        name: 'Germany'
      },
      { key: 'fr',
        name: 'France'
      }
    ]);
  }

  /**
   * business, entertainment, general, health, science, sports, technology
   */
  private getCategoryDictionary(): void {
    this.categoryDictionarySubject.next([
      { key: 'business',
        name: 'Business'
      },
      { key: 'general',
        name: 'General'
      }
    ]);
  }

  public async getNewsListByTYpe(type: string, params: any): Promise<void> {
    try {
      const search = { ...params };

      if (search.from) {
        search.from = DateTime.fromJSDate(search.from).toISODate();
      }

      if (search.to) {
        search.to = DateTime.fromJSDate(search.to).toISODate();
      }

      const url = this.httpService.createUrl({
        type,
        search
      });

      const data = await this.httpService.get(url);
      this.newsListItemSubject.next(data.articles || []);

    } catch (err) {
      this.dialogService.openDialog({
        title: err.name || 'Error',
        message: err.message
       });
    }
  }

  public getSearchUrl(params: any): string {
    const type = params.type ? `/${params.type}` : '';
    const url = new URL(('http://localhost:4401').concat(type));

    const search = {...params};
    if (search.from) {
      search.from = DateTime.fromJSDate(search.from).toISODate();
    }
    if (search.to) {
      search.to = DateTime.fromJSDate(search.to).toISODate();
    }

    for (const key in search) {
      if (search.hasOwnProperty(key)) {
        if (search[key].length > 0) {
          url.searchParams.set(key, search[key]);
        }
      }
    }

    return url.search;
  }

  public clearNews(): void {
    this.newsListItemSubject.next([]);
  }

  public getDefaultParams(): any {
    return this.httpService.getQueryParams();
  }

  public async getAllLikedNews(): Promise<void> {
    const likeNews = await this.indexDBService.getAllLikedNews();
    this.newsListItemSubject.next(likeNews);
  }

  public async getAllLikedNewsIds(): Promise<void> {
    const likeNewsUrl = await this.indexDBService.getAllLikedNewsIds();
    this.newsLikeItemSubject.next(likeNewsUrl);
  }

  public addLikedNewsItem(newsItem: INewsItem): void {
    this.indexDBService.addNewsItem([newsItem]);
  }

  public deleteLikedNewsItem(newsItem: INewsItem): void {
    this.indexDBService.deleteNewsItem([newsItem.url]);
  }

  public setNewsType(newsType: string): void {
    this.newsTypeSubject.next(newsType);
  }
}
