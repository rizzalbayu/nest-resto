import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetCurrentUser } from 'src/common/decorator/get-user-by-id.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/users/entities/role.enum';
import { CreateOrderDto, OrderDto, UpdateItemStatus } from './dto/order.dto';
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
}
