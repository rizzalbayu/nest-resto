import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Get()
  async findAll() {
    const data = await this.menuService.getAll();
    return data;
  }

  @Post()
  async create(@Body() body: CreateMenuDto) {
    const data = await this.menuService.addData(body);
    return data;
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.menuService.findOne(id);
    return data;
  }

  @Patch('/:id')
  async patch(@Param('id') id: string, @Body() body: UpdateMenuDto) {
    const data = await this.menuService.update(id, body);
    return data;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const result = await this.menuService.delete(id);
    return result;
  }
}
