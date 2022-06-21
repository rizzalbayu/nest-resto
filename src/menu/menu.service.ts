import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/common/model/page';
import { PageUtil } from 'src/common/util/page.util';
import { Repository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { MenuType } from './entities/menu-type.enum';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async getAll(
    pageUtil: PageUtil,
    type: MenuType,
    active: string,
    order: string,
    direction: string,
  ): Promise<Page<Menu>> {
    let query = this.menuRepository
      .createQueryBuilder('menus')
      .andWhere('menus.deletedAt IS NULL');
    if (type) query = query.andWhere('menus.type = :type', { type });

    if (active)
      query = query.andWhere('menus.isActive = :active', {
        active: active && active.toLowerCase() == 'true' ? 1 : 0,
      });

    if (order) {
      if (order == 'createdAt')
        query = query.addOrderBy(
          'menus.createdAt',
          direction.toLowerCase() == 'desc' ? 'DESC' : 'ASC',
        );
      if (order == 'price')
        query = query.addOrderBy(
          'menus.price',
          direction.toLowerCase() == 'desc' ? 'DESC' : 'ASC',
        );
    }
    const [results, total] = await query
      .take(pageUtil.size)
      .skip(pageUtil.skipRecord())
      .getManyAndCount();
    return new Page(results, total, pageUtil);
  }

  async addData(data: CreateMenuDto, user: string): Promise<Menu> {
    const menu = new Menu();
    menu.name = data.name;
    menu.description = data.description;
    menu.price = data.price;
    menu.originalPrice = data.price;
    menu.type = data.type;
    menu.createdBy = user;
    menu.updatedBy = user;
    return await this.menuRepository.save(menu);
  }

  async findOne(id: string): Promise<Menu> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .andWhere('menu.deletedAt IS NULL')
      .andWhere('menu.id = :menuId', { menuId: id })
      .getOne();
  }

  async update(id: string, data: UpdateMenuDto, user: string): Promise<Menu> {
    let menu = new Menu();
    menu = await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.id = :menuId', { menuId: id })
      .andWhere('menu.deletedAt IS NULL')
      .getOne();
    if (menu) {
      menu.name = data.name;
      menu.description = data.description;
      menu.updatedBy = user;
      menu.price = data.price;
      menu.type = data.type;
      menu.version++;
      await this.menuRepository.update(id, menu);
      return menu;
    }
  }

  async delete(id: string, user: string): Promise<Menu> {
    const menu = await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.id = :menuId', { menuId: id })
      .andWhere('menu.deletedAt IS NULL')
      .getOne();
    if (menu) {
      menu.updatedBy = user;
      menu.deletedBy = user;
      menu.deletedAt = new Date(Date.now());
      await this.menuRepository.update(id, menu);
      return menu;
    }
  }
}
