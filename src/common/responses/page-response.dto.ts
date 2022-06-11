import { PaginationDto } from './pagination.dto';
import { Page } from '../model/page';

export class PageResponseDto<T> {
  pagination: PaginationDto;
  content: T[];
  constructor(partial: Partial<PageResponseDto<T>>) {
    Object.assign(this, partial);
  }
  static fromPage<E, T>(
    page: Page<E>,
    transformer: (i: E) => T,
  ): PageResponseDto<T> {
    const result = new PageResponseDto({
      content: page.content.map((item) => transformer(item)),
      pagination: new PaginationDto({
        page: +page.page(),
        size: +page.size(),
        next: page.nextPage(),
        previous: page.prevPage(),
        totalItem: page.total,
        totalPage: page.totalPage(),
      }),
    });
    return result;
  }
}
