export class PageUtil {
  page: number;
  size: number;
  skipRecord = () => {
    return Math.max((this.page - 1) * this.size, 0);
  };
  constructor(page: number, size: number) {
    this.page = +page;
    this.size = +size;
  }
}
