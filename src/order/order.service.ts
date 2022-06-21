import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/common/model/page';
import { PageUtil } from 'src/common/util/page.util';
import { MenuService } from 'src/menu/menu.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.dto';
import { ItemStatus } from './entity/item-status.enum';
import { OrderStatus } from './entity/order-status.enum';
import { OrderType } from './entity/order-type.enum';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order_item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepository: Repository<OrderItem>,
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
      if (body.status == OrderStatus.SUCCESS) {
        orderItem.status = ItemStatus.DELIVERED;
      } else {
        orderItem.status = ItemStatus.WAITING;
      }
      orderList.push(orderItem);
    }

    try {
      order.type = body.type ? body.type : OrderType.TAKE_AWAY;
      order.createdBy = userEmail;
      order.updatedBy = userEmail;
      order.user = user;
      order.orderNumber = orderNumber;
      order.orderItems = orderList;
      order.status = body.status ? body.status : OrderStatus.WAITINIG;
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
    let data = await this.getOrderByNumberOrId(orderNumber);
    while (data) {
      orderNumber = await this.setOrderNumber(date);
      data = await this.getOrderByNumberOrId(orderNumber);
    }
    return orderNumber;
  }

  async getOrderByNumberOrId(orderNumberOrId: string): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where(
        'order.orderNumber = :orderNumberOrId OR order.id = :orderNumberOrId',
        {
          orderNumberOrId,
        },
      )
      .getOne();
  }

  async setOrderNumber(date: string): Promise<string> {
    const randomNumber = Math.random().toString(36).slice(-7).toUpperCase();
    return date + randomNumber;
  }

  async updateWaitingOrder(itemId: string, user: string, status: ItemStatus) {
    const data = await this.itemRepository
      .createQueryBuilder('orderItem')
      .innerJoinAndSelect('orderItem.order', 'order')
      .where('orderItem.id = :itemId', { itemId })
      .andWhere('orderItem.status = :status', { status: ItemStatus.WAITING })
      .getOne();

    if (!data) throw new NotFoundException('Order Item Not Found');
    try {
      data.status = status;
      data.updatedBy = user;
      await this.itemRepository.save(data);
      const orderOnProcess = await this.getorderOnProcess(data.order.id);
      if (!orderOnProcess) {
        const order = await this.getOrderByNumberOrId(data.order.id);
        order.status = OrderStatus.SUCCESS;
        order.updatedBy = user;
        await this.orderRepository.save(order);
      }
      return data;
    } catch (error) {
      throw new BadRequestException('Change status Failed');
    }
  }

  async getorderOnProcess(orderId: string): Promise<OrderItem> {
    return await this.itemRepository
      .createQueryBuilder('orderItem')
      .innerJoinAndSelect('orderItem.order', 'order')
      .where('order.id = :orderId', { orderId })
      .andWhere('orderItem.status != :status', { status: ItemStatus.DELIVERED })
      .getOne();
  }

  async updateOrderToSuccess(orderid: string, user: string): Promise<Order> {
    const data = await this.getOrderDataById(orderid);
    if (!data) throw new NotFoundException('Order Not Found');

    data.status = OrderStatus.SUCCESS;
    data.updatedBy = user;
    for (const item of data.orderItems) {
      item.status = ItemStatus.DELIVERED;
      item.updatedBy = user;
    }
    await this.orderRepository.save(data);
    return data;
  }

  async getOrderDataById(orderId: string): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .where('order.id = :orderId', { orderId })
      .getOne();
  }

  async getAllOrder(
    pageUtil: PageUtil,
    status: OrderStatus,
    order: string,
    direction: string,
  ): Promise<Page<Order>> {
    let query = this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect(
        'order.orderItems',
        'orderItems',
        'orderItems.deletedAt IS NULL',
      )
      .innerJoinAndSelect('order.user', 'user', 'user.deletedAt IS NULL')
      .innerJoinAndSelect('orderItems.menu', 'menus', 'menus.deletedAt IS NULL')
      .where('order.deletedAt IS NULL');
    if (status) query = query.andWhere('order.status = :status', { status });
    if (order) {
      query = query.addOrderBy(
        'order.createdAt',
        direction.toLowerCase() == 'desc' ? 'DESC' : 'ASC',
      );
    }
    const [results, total] = await query
      .take(pageUtil.size)
      .skip(pageUtil.skipRecord())
      .getManyAndCount();
    return new Page(results, total, pageUtil);
  }
}
