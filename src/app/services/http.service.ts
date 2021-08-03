import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';

import { IIterableObject } from '../interfaces/app.interface';

import { IResponseObject, ISearchConfig } from '../interfaces/http.interface';


@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private serviceHttp = environment.serviceHttp;
  private defaultSearch: ISearchConfig = {
    sortBy: 'popularity',
    apiKey: environment.newsApiKey
  };

  constructor(
    private httpClient: HttpClient,
    private location: Location
  ) {}

  public get(url: string, headers?: IIterableObject<any>): Promise<IResponseObject> {
    return this.httpClient
      .get(url, {
        headers
      })
      .toPromise()
      .then(response => response as IResponseObject);
  }

  public post(url: string, data: any, headers?: IIterableObject<any>): Promise<IResponseObject> {
    return this.httpClient
      .post(url, data, {
        headers
      })
      .toPromise()
      .then(response => response as IResponseObject);
  }

  public createUrl(params: IIterableObject<any>): string {
    const type = params.type ? `/${params.type}` : '';
    const url = new URL((this.serviceHttp).concat(type));

    const search = Object.assign({}, this.defaultSearch, params.search);

    for (const key in search) {
      if (search.hasOwnProperty(key)) {
        url.searchParams.set(key, search[key]);
      }
    }

    return url.toString();
  }

  public getQueryParams(): IIterableObject<any> {
    const path = this.location.path();
    const url = new URL((this.serviceHttp).concat(path));
    const params = {};
    url.searchParams.forEach((key, value) => {
      params[value] = key;
    });
    return params;
  }
}

