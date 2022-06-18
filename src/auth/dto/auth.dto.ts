import { User } from 'src/users/entities/user.entity';

export class registerDto {
  username: string;
  password: string;
  fullName?: string;
}

export class loginDto {
  username: string;
  fullname: string;
  role: string;
  accessToken: string;
  constructor(partial: Partial<loginDto>) {
    Object.assign(this, partial);
  }
  static fromEntity(user: User, accessToken: string): loginDto {
    return new loginDto({
      username: user.email,
      fullname: user.fullName,
      role: user.role,
      accessToken: accessToken,
    });
  }
}
