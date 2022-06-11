export class PaginationDto {
  page: number;
  size: number;
  next: number;
  previous: number;
  totalItem: number;
  totalPage: number;
  constructor(partial: Partial<PaginationDto>) {
    Object.assign(this, partial);
  }
}
