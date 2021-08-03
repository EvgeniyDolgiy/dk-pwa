import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { INewsItem } from '../../interfaces/news.interface';

import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})

export class NewsListComponent implements OnInit, OnDestroy {
  @Input() type: string;
  newsList: INewsItem[];
  newsLikeList: string[];

  private subscriptions: Subscription[];

  constructor(private newsService: NewsService) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    const newsListSubscription$ = this.newsService.newsList.subscribe((data) => {
      this.newsList = data;
    });

    const newsLikeListSubscription$ = this.newsService.newsLikeList.subscribe((data) => {
      this.newsLikeList = data;
    });

    this.subscriptions.push(newsListSubscription$, newsLikeListSubscription$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }

  public likeNewsItem(newsItem: INewsItem): void {
    this.newsService.addLikedNewsItem(newsItem);
  }

  public dislikeNewsItem(newsItem: INewsItem): void {
    this.newsService.deleteLikedNewsItem(newsItem);
  }

}
