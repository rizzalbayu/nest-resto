import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/responses/base-response.dto';
import { CreateMenuDto, MenuDto, UpdateMenuDto } from './dto/menu.dto';
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
  async create(@Body() body: CreateMenuDto): Promise<BaseResponseDto<MenuDto>> {
    const data = await this.menuService.addData(body);
    return new BaseResponseDto({
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<MenuDto>> {
    const data = await this.menuService.findOne(id);
    return new BaseResponseDto({
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    });
  }

  @Patch('/:id')
  async patch(
    @Param('id') id: string,
    @Body() body: UpdateMenuDto,
  ): Promise<BaseResponseDto<MenuDto>> {
    const data = await this.menuService.update(id, body);
    return new BaseResponseDto({
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    });
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<BaseResponseDto<string>> {
    const result = await this.menuService.delete(id);
    return new BaseResponseDto({
      success: result == 'SUCCESS' ? true : false,
      message: result,
      data: null,
    });
  }
}
