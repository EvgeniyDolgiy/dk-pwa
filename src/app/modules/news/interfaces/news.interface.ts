export enum NEWS_TYPE_OPTIONS {
  SEARCH = 'search',
  RANGE = 'range',
  LANGUAGE = 'language',
  COUNTRY = 'country',
  CATEGORY = 'category',
  FIND = 'find'
}

export interface INewsItemSource {
  id: string;
  name: string;
}

export interface INewsItem {
  id?: string;
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: INewsItemSource;
  title: string;
  url: string;
  urlToImage: string;
}

export interface ILanguageDictionary {
  key: string;
  name: string;
}

export interface ICountryDictionary {
  key: string;
  name: string;
}

export interface ICategoryDictionary {
  key: string;
  name: string;
}
