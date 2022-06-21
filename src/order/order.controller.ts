import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetCurrentUser } from 'src/common/decorator/get-user-by-id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { PageResponseDto } from 'src/common/responses/page-response.dto';
import { PageUtil } from 'src/common/util/page.util';
import { UserRole } from 'src/users/entities/role.enum';
import { AllOrderDto } from './dto/AllOrder.dto';
import { CreateOrderDto, OrderDto, UpdateItemStatus } from './dto/order.dto';
import { OrderStatus } from './entity/order-status.enum';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async postOrder(
    @Body() body: CreateOrderDto,
    @GetCurrentUser() user: string,
  ) {
    const data = await this.orderService.createOrder(body, user);
    return {
      success: data ? true : false,
      message: null,
      data: data ? OrderDto.fromEntity(data) : null,
    };
  }

  @Patch('updateWaitingOrder/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateItemStatus(
    @Param('id') id: string,
    @GetCurrentUser() user: string,
    @Body() body: UpdateItemStatus,
  ) {
    const data = await this.orderService.updateWaitingOrder(
      id,
      user,
      body.status,
    );
    return {
      success: data ? true : false,
      message: null,
      data: null,
    };
  }

  @Patch('updateOrderSuccess/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateOrderToSuccess(
    @Param('id') id: string,
    @GetCurrentUser() user: string,
  ) {
    const data = await this.orderService.updateOrderToSuccess(id, user);
    return {
      success: data ? true : false,
      message: null,
      data: null,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllOrder(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('status') status: OrderStatus,
    @Query('orderBy') order = 'createdAt',
    @Query('direction') direction = 'DESC',
  ) {
    const data = await this.orderService.getAllOrder(
      new PageUtil(page, size),
      status,
      order,
      direction,
    );
    return {
      success: data ? true : false,
      message: null,
      data: PageResponseDto.fromPage<Order, AllOrderDto>(data, (item) => {
        return AllOrderDto.fromEntity(item);
      }),
    };
  }
}
