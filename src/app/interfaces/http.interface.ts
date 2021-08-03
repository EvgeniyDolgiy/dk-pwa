export interface IArticleItemSource {
  id: string | null;
  name: string | null;
}

export interface IArticleItem {
  source: IArticleItemSource;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string; // 200 chars
}

export interface IResponseObject {
  status: string;
  totalResults: number;
  articles: IArticleItem[];
}

export interface ISearchConfig {
  sortBy: string;
  apiKey: string;
  q?: string;
  from?: string;
  to?: string;
  language?: string;
  country?: string;
  category?: string;
}
