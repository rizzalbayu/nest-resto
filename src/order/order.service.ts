import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuService } from 'src/menu/menu.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.dto';
import { OrderStatus } from './entity/order-status.enum';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order_item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly menuService: MenuService,
    private readonly userService: UsersService,
  ) {}

  async createOrder(body: CreateOrderDto, userEmail: string): Promise<Order> {
    const user = await this.userService.findByEmail(userEmail);
    const order = new Order();
    const orderList = [];
    const orderNumber = await this.getOrderNumber();

    for (const menus of body.orderList) {
      const menu = await this.menuService.findOne(menus.menuId);
      const orderItem = new OrderItem();
      orderItem.menu = menu;
      orderItem.createdBy = userEmail;
      orderItem.updatedBy = userEmail;
      orderItem.orderPrice = menu.price;
      orderItem.quantity = menus.quantity;
      orderList.push(orderItem);
    }

    try {
      order.createdBy = userEmail;
      order.updatedBy = userEmail;
      order.user = user;
      order.orderNumber = orderNumber;
      order.orderItems = orderList;
      order.status = OrderStatus.SUCCESS;
      await this.orderRepository.save(order);
      return order;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Order Failed');
    }
  }

  async getOrderNumber(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let orderNumber = await this.setOrderNumber(date);
    let data = await this.getOrderByNumber(orderNumber);
    while (data) {
      orderNumber = await this.setOrderNumber(date);
      data = await this.getOrderByNumber(orderNumber);
    }
    return orderNumber;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.orderNumber = :orderNumber', { orderNumber })
      .getOne();
  }

  async setOrderNumber(date: string): Promise<string> {
    const randomNumber = Math.random().toString(36).slice(-7).toUpperCase();
    return date + randomNumber;
  }
}
