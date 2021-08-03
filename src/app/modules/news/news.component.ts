import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';

import { NewsService } from './services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  type: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private newsService: NewsService
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    const activateRouteParamsSubscription$ = this.activateRoute.params.subscribe((params) => {
      if (params && params.type) {
        this.newsService.setNewsType(params.type);
      }
    });

    const newsTypeSubscription$ = this.newsService.newsType.subscribe((data) => {
      this.type = data;
    });

    this.subscriptions.push(activateRouteParamsSubscription$, newsTypeSubscription$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }

}
