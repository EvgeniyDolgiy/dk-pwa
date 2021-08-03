import { NEWS_TYPE } from './../../../interfaces/app.enum';

export interface IMenuItem {
  id: string;
  title: string;
  index: number;
  link: NEWS_TYPE;
}
