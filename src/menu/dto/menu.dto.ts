import { Menu } from '../entities/menu.entity';

export class CreateMenuDto {
  name: string;
  description: string;
  user: string;
}

export class UpdateMenuDto {
  name: string;
  description: string;
  user: string;
}

export class MenuDto {
  id: string;
  name: string;
  description: string;
  user: string;
  createdAt: Date;
  constructor(partial: Partial<MenuDto>) {
    Object.assign(this, partial);
  }
  static fromEmtity(menu: Menu): MenuDto {
    return new MenuDto({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      createdAt: menu.createdAt,
    });
  }
}
