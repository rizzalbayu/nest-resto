import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { TransformInterceptor } from 'src/common/interception/transform.interceptor';
import { PageResponseDto } from 'src/common/responses/page-response.dto';
import { GetCurrentUser } from 'src/common/util/get-user-by-id.decorator';
import { PageUtil } from 'src/common/util/page.util';
import { CreateMenuDto, MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Controller('menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @GetCurrentUser() user: string,
  ) {
    const data = await this.menuService.getAll(new PageUtil(page, size));
    console.log(user);

    return {
      success: data ? true : false,
      message: null,
      data: PageResponseDto.fromPage<Menu, MenuDto>(data, (item) => {
        return MenuDto.fromEmtity(item);
      }),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateMenuDto) {
    const data = await this.menuService.addData(body);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.menuService.findOne(id);
    if (!data) throw new NotFoundException(`menu id ${id} not found`);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async patch(@Param('id') id: string, @Body() body: UpdateMenuDto) {
    const data = await this.menuService.update(id, body);
    if (!data) throw new NotFoundException(`menu id ${id} not found`);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEmtity(data) : null,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const data = await this.menuService.delete(id);
    if (!data) throw new NotFoundException(`menu id ${id} not found`);
    return {
      success: data ? true : false,
      message: null,
      data: null,
    };
  }
}
