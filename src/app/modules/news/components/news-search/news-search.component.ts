import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';

import {
  ILanguageDictionary,
  ICountryDictionary,
  ICategoryDictionary
} from '../../interfaces/news.interface';

import { NEWS_TYPE } from '../../../../interfaces/app.enum';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-search',
  templateUrl: './news-search.component.html',
  styleUrls: ['./news-search.component.scss']
})

export class NewsSearchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: string;

  query = new FormControl('');
  language = new FormControl('');
  country = new FormControl('');
  category = new FormControl('');
  period: FormGroup;
  queryParams: any = {};
  formFieldList: string[] = [];
  languageDictionary: ILanguageDictionary[];
  countryDictionary: ICountryDictionary[];
  categoryDictionary: ICategoryDictionary[];

  private subscriptions: Subscription[];

  constructor(private newsService: NewsService) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.period = new FormGroup({
      from: new FormControl(new Date(year, month, 13)),
      to: new FormControl(new Date(year, month, 16))
    });

    this.setDefaultParams();

    this.subscriptions = [];
  }

  ngOnInit(): void {
    const languageDisctionarySubscription$ = this.newsService.languageDictionary.subscribe((data) => {
      this.languageDictionary = data;
    });

    const countryDictionarySubscription$ = this.newsService.countryDictionary.subscribe((data) => {
      this.countryDictionary = data;
    });

    const categoryDictionarySubscription$ = this.newsService.categoryDictionary.subscribe((data) => {
      this.categoryDictionary = data;
    });

    this.subscriptions.push(
      languageDisctionarySubscription$,
      countryDictionarySubscription$,
      categoryDictionarySubscription$
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type.currentValue) {
      this.formFieldList = this.newsService.newsTypeOptions[changes.type.currentValue];
      if (!changes.type.firstChange) {
        this.clearSearchForm();
      }
      if (changes.type.currentValue === NEWS_TYPE.LIKE) {
        this.newsService.getAllLikedNews();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }

  search(event): void {
    switch (this.type) {
      case NEWS_TYPE.EVERYTHING:
        this.newsService.getNewsListByTYpe(
          this.type,
          {
            q: this.query.value,
            from: this.period.value.from,
            to: this.period.value.to,
            language: this.language.value
          }
        );
        break;
      case NEWS_TYPE.TOP_HEADLINES:
        this.newsService.getNewsListByTYpe(
          this.type,
          {
            country: this.country.value,
            category: this.category.value
          }
        );
        break;
     }
  }

  getSearchUrl(): any {
    switch (this.type) {
      case NEWS_TYPE.EVERYTHING:
        return {
          q: this.query.value,
          from: DateTime.fromJSDate(this.period.value.from).toISODate(),
          to: DateTime.fromJSDate(this.period.value.to).toISODate(),
          language: this.language.value
        };
      case NEWS_TYPE.TOP_HEADLINES:
        return {
          country: this.country.value,
          category: this.category.value
        };
     }
  }

  private setDefaultParams(): void {
    const params = this.newsService.getDefaultParams();

    if (params.q) {
      this.query.setValue(params.q);
    }
    if (params.from) {
      this.period.controls.from.setValue(params.from);
    }
    if (params.to) {
      this.period.controls.to.setValue(params.to);
    }
    if (params.language) {
      this.language.setValue(params.language);
    }
    if (params.country) {
      this.country.setValue(params.country);
    }
    if (params.category) {
      this.category.setValue(params.category);
    }
  }

  private clearSearchForm(): void {
    this.query.setValue('');
    this.language.setValue('');
    this.country.setValue('');
    this.category.setValue('');
    this.period.controls.from.setValue('');
    this.period.controls.to.setValue('');
  }

}
