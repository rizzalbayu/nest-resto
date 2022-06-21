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
import { GetCurrentUser } from 'src/common/decorator/get-user-by-id.decorator';
import { PageUtil } from 'src/common/util/page.util';
import { CreateMenuDto, MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/users/entities/role.enum';
import { MenuType } from './entities/menu-type.enum';

@Controller('menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('type') type: MenuType,
    @Query('active') active: string,
    @Query('order') order = 'createdAt',
    @Query('direction') direction = 'desc',
  ) {
    const data = await this.menuService.getAll(
      new PageUtil(page, size),
      type,
      active,
      order,
      direction,
    );
    return {
      success: data ? true : false,
      message: null,
      data: PageResponseDto.fromPage<Menu, MenuDto>(data, (item) => {
        return MenuDto.fromEntity(item);
      }),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateMenuDto, @GetCurrentUser() user: string) {
    const data = await this.menuService.addData(body, user);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEntity(data) : null,
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const data = await this.menuService.findOne(id);
    if (!data) throw new NotFoundException(`menu id ${id} not found`);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEntity(data) : null,
    };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async patch(
    @Param('id') id: string,
    @Body() body: UpdateMenuDto,
    @GetCurrentUser() user: string,
  ) {
    const data = await this.menuService.update(id, body, user);
    if (!data) throw new NotFoundException(`menu id ${id} not found`);
    return {
      success: data ? true : false,
      message: null,
      data: data ? MenuDto.fromEntity(data) : null,
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string, @GetCurrentUser() user: string) {
    const data = await this.menuService.delete(id, user);
    if (!data) throw new NotFoundException(`menu id ${id} not found`);
    return {
      success: data ? true : false,
      message: null,
      data: null,
    };
  }
}
