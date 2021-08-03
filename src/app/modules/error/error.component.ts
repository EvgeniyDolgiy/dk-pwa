import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';

import { IError } from '../../interfaces/error.interface';
import { IIterableObject } from '../../interfaces/app.interface';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {
  type: string | null = null;
  errors: IIterableObject<IError> = {};
  error: IError;


  private subscriptions: Subscription[];

  constructor(
    private activateRoute: ActivatedRoute,
    private errorService: ErrorService
  ) {
    this.subscriptions = [];
  }

  ngOnInit(): void {

    const activateRouteParamsSubscription$ = this.activateRoute.params.subscribe((params) => {
      if (params && params.type) {
        this.type = params.type;
        this.getPageErrorType();
      }
    });

    const errorsSubscription$ = this.errorService.errors.subscribe((data) => {
      this.errors = data;
      this.getPageErrorType();
    });

    this.subscriptions.push(activateRouteParamsSubscription$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscriber) => {
      subscriber.unsubscribe();
    });
  }

  private getPageErrorType(): void {
    if (this.type && this.errors[this.type]) {
      this.error = this.errors[this.type];
    } else {
      this.error = {
        title: 'Some error',
        type: this.type,
        description: 'Are you shure?'
      };
    }
  }

}
