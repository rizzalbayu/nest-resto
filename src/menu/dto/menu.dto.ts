import { MenuType } from '../entities/menu-type.enum';
import { Menu } from '../entities/menu.entity';

export class CreateMenuDto {
  name: string;
  description: string;
  user: string;
  price: number;
  type: MenuType;
}

export class UpdateMenuDto {
  name: string;
  description: string;
  user: string;
  price: number;
  type: MenuType;
}

export class MenuDto {
  id: string;
  name: string;
  description: string;
  user: string;
  createdAt: Date;
  image: string;
  price: number;
  originalPrice: number;
  type: string;
  isActive: boolean;
  constructor(partial: Partial<MenuDto>) {
    Object.assign(this, partial);
  }
  static fromEntity(menu: Menu): MenuDto {
    return new MenuDto({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      image: menu.image,
      price: +menu.price,
      originalPrice: +menu.originalPrice,
      type: menu.type,
      createdAt: menu.createdAt,
      isActive: menu.isActive,
    });
  }
}
