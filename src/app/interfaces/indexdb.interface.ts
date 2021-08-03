import { DBSchema } from 'idb';

import { INewsItem } from '../modules/news/interfaces/news.interface';

export interface IDBSchema extends DBSchema {
  news: {
    value: INewsItem;
    key: string;
  };
}

type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;


export type StoreName = KnownKeys<IDBSchema>;
