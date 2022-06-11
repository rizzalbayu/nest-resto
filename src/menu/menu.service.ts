import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/common/model/page';
import { PageUtil } from 'src/common/util/page.util';
import { Repository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async getAll() {
    const pageUtil = new PageUtil(1, 10);
    const [results, total] = await this.menuRepository
      .createQueryBuilder('menus')
      .andWhere('menus.deletedAt IS NULL')
      .take(pageUtil.size)
      .skip(pageUtil.skipRecord())
      .getManyAndCount();
    return new Page(results, total, pageUtil);
  }

  async addData(data: CreateMenuDto) {
    const menu = new Menu();
    menu.name = data.name;
    menu.description = data.description;
    menu.createdBy = data.user;
    menu.updatedBy = data.user;
    return await this.menuRepository.save(menu);
  }

  async findOne(id: string) {
    return await this.menuRepository
      .createQueryBuilder('menus')
      .andWhere('menus.deletedAt IS NULL')
      .andWhere('menus.id = :menuId', { menuId: id })
      .getOne();
  }

  async update(id: string, data: UpdateMenuDto) {
    const menu = await this.findOne(id);
    if (menu) {
      menu.name = data.name;
      menu.description = data.description;
      menu.updatedBy = data.user;
      const result = await this.menuRepository.update(id, menu);
      console.log(result);
      return menu;
    }
  }

  async delete(id: string) {
    const menu = await this.findOne(id);
    if (menu) {
      menu.updatedBy = 'user@gmail.com';
      menu.deletedBy = 'user@gmail.com';
      menu.deletedAt = new Date(Date.now());
      await this.menuRepository.update('id', menu);
      return 'SUCCESS';
    } else {
      return 'DATA NOT FOUND';
    }
  }
}
