import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/common/interception/transform.interceptor';
import { PageResponseDto } from 'src/common/responses/page-response.dto';
import { PageUtil } from 'src/common/util/page.util';
import { CreateMenuDto, MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Controller('menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Get()
  async findAll(@Query('page') page = 1, @Query('size') size = 10) {
    const data = await this.menuService.getAll(new PageUtil(page, size));
    return {
      success: data ? true : false,
      message: null,
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
    if (!data)
      throw new HttpException(`menu id ${id} not found`, HttpStatus.NOT_FOUND);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Patch('/:id')
  async patch(@Param('id') id: string, @Body() body: UpdateMenuDto) {
    const data = await this.menuService.update(id, body);
    if (!data)
      throw new HttpException(`menu id ${id} not found`, HttpStatus.NOT_FOUND);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const data = await this.menuService.delete(id);
    if (!data)
      throw new HttpException(`menu id ${id} not found`, HttpStatus.NOT_FOUND);
    return {
      success: data ? true : false,
      message: null,
      data: null,
    };
  }
}
