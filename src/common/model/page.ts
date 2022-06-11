import { PageUtil } from '../util/page.util';

export class Page<T> {
  private pageUtil: PageUtil;
  content: T[];
  total: number;
  totalPage = () => {
    return Math.ceil(this.total / this.pageUtil.size);
  };
  page = () => {
    return this.pageUtil.page;
  };
  size = () => {
    return this.pageUtil.size;
  };
  nextPage = () => {
    return Math.min(this.totalPage(), this.pageUtil.page + 1);
  };
  prevPage = () => {
    return Math.max(1, this.pageUtil.page - 1);
  };
  constructor(content: T[], total: number, pageUtil: PageUtil) {
    this.content = content;
    this.total = total;
    this.pageUtil = pageUtil;
  }
}
