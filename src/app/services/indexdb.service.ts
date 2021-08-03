import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB, StoreValue, StoreKey, deleteDB } from 'idb';
import { Observable, Subject } from 'rxjs';

import { IDBSchema, StoreName } from '../interfaces/indexdb.interface';
import { INewsItem } from '../modules/news/interfaces/news.interface';


interface IDBConfig {
  name: string;
  version: number;
  storesName: StoreName[];
}

@Injectable({
  providedIn: 'root'
})
export class IndexDBService {

  static readonly IDB_CONFIG: IDBConfig = {
    name: 'dk-pwa',
    version: 1,
    storesName: ['news']
  };
  private INIT_DB_PROMISE_REF: Promise<void> = null;
  private indexDataBase: IDBPDatabase<IDBSchema>;
  private readonly storesChange: {
    [key in StoreName]?: Subject<void>
  };

  constructor() {
    const { storesName } = IndexDBService.IDB_CONFIG;

    this.storesChange = {};
    for (const storeName of storesName) {
      this.storesChange[storeName] = new Subject<void>();
    }
  }

  private static async upgradeDataBase(database: IDBPDatabase<IDBSchema>): Promise<void> {
    const { storesName } = IndexDBService.IDB_CONFIG;

    for (const storeName of storesName) {
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    }

  }

  private async _initDB(isFirstCall: boolean = true): Promise<void> {
    const { name, version } = IndexDBService.IDB_CONFIG;

    try {
      this.indexDataBase = await openDB<IDBSchema>(name, version, {
        upgrade: async (db: IDBPDatabase<IDBSchema>, oldVersion: number, newVersion: number) => {
          try {
            await IndexDBService.upgradeDataBase(db);
          } catch (error) {
          }
        }
      });
    } catch (error) {
      if (isFirstCall) {
        await deleteDB(name);
        return this._initDB(false);
      }
    }
  }

  initDB(): Promise<void> {
    if (!this.INIT_DB_PROMISE_REF) {
      this.INIT_DB_PROMISE_REF = this._initDB();
    }
    return this.INIT_DB_PROMISE_REF;
  }

  private async addItems<T extends StoreValue<IDBSchema, StoreName>>(items: T[], storeName: StoreName): Promise<boolean> {
    let isError = true;

    try {
      if (!this.indexDataBase) {
        await this.initDB();
      }

      const tx = this.indexDataBase.transaction(storeName, 'readwrite');

      items.forEach((item: T) => {
        tx.store.put(item);
      });

      await tx.done;
    } catch (error) {
      isError = true;
    }

    return !isError;
  }

  private async deleteItems<T extends StoreKey<IDBSchema, StoreName>>(items: T[], storeName: StoreName): Promise<boolean> {
    let isError = true;

    try {
      if (!this.indexDataBase) {
        await this.initDB();
      }


      const tx = this.indexDataBase.transaction(storeName, 'readwrite');

      items.forEach((item: T) => {
        tx.store.delete(item);
      });

      await tx.done;
    } catch (error) {
      isError = true;
    }

    return !isError;
  }

  private async getAllItems<T>(storeName: StoreName): Promise<T[]> {
    let items = [];

    try {
      if (!this.indexDataBase) {
        await this.initDB();
      }

      items = await this.indexDataBase.transaction(storeName).store.getAll();
    } catch (error) {
    }

    return items;
  }

  private async clearStorage(storeName: StoreName): Promise<void> {
    if (!this.indexDataBase) {
      await this.initDB();
    }

    await this.indexDataBase.clear(storeName);
  }

  async addNewsItem(newsItems: INewsItem[]): Promise<void> {
    const newsItemsDB = newsItems.map((item) => {
      item.id = item.url;
      return item;
    });
    await this.addItems<INewsItem>(newsItemsDB, 'news');
    this.storesChange.news.next();
  }

  async deleteNewsItem(key: string[]): Promise<void> {
    await this.deleteItems(key, 'news');
    this.storesChange.news.next();
  }

  getAllLikedNews(): Promise<INewsItem[]> {
    return this.getAllItems<INewsItem>('news');
  }

  async getAllLikedNewsIds(): Promise<string[]> {
    return (await this.getAllItems<INewsItem>('news')).map((item: INewsItem) => {
      return item.id;
    });
  }

  async clearNews(): Promise<void> {
    await this.clearStorage('news');
  }

  dataChanged(storeName: StoreName): Observable<void> {
    return this.storesChange[storeName].asObservable();
  }
}
