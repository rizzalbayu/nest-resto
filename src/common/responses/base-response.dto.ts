export class BaseResponseDto<T> {
  success: boolean;
  data: T;
  message: string;
  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
