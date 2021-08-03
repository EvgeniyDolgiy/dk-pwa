import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IIterableObject } from '../../interfaces/app.interface';
import { IError } from '../../interfaces/error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly errorsSubject: BehaviorSubject<IIterableObject<IError>>;

  public get errors(): Observable<IIterableObject<IError>> {
    return this.errorsSubject.asObservable();
  }


  constructor() {
    this.errorsSubject = new BehaviorSubject({
      400: {
        title: 'Bad Request',
        type: '400',
        description: 'The server could not understand the request due to invalid syntax.'
      },
      404: {
        title: 'Not Found',
        type: '404',
        description: 'The server can not find the requested resource. In the browser, this means the URL is not recognized'
      },
      500: {
        title: 'Internal Server Error',
        type: '500',
        description: 'The server has encountered a situation it doesn\'t know how to handle.'
      }
    });
  }
}
