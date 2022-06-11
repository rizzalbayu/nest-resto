import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/common/interception/transform.interceptor';
import { BaseResponseDto } from 'src/common/responses/base-response.dto';
import { PageResponseDto } from 'src/common/responses/page-response.dto';
import { CreateMenuDto, MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Controller('menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Get()
  async findAll() {
    const data = await this.menuService.getAll();
    return {
      success: 'Success',
      message: '',
      data: PageResponseDto.fromPage<Menu, MenuDto>(data, (item) => {
        return MenuDto.fromEmtity(item);
      }),
    };
  }

  @Post()
  async create(@Body() body: CreateMenuDto) {
    const data = await this.menuService.addData(body);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.menuService.findOne(id);
    return {
      success: 'Success',
      message: '',
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Patch('/:id')
  async patch(@Param('id') id: string, @Body() body: UpdateMenuDto) {
    const data = await this.menuService.update(id, body);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const result = await this.menuService.delete(id);
    return {
      success: result == 'SUCCESS' ? true : false,
      message: result,
      data: null,
    };
  }
}
