import { Menu } from 'src/menu/entities/menu.entity';
import { Order } from '../entity/order.entity';
import { OrderItem } from '../entity/order_item.entity';

export class CreateOrderDto {
  orderId?: string;
  orderNumber?: string;
  orderList: CreateOrderItemDto[];
  status?: string;
  createdAt?: Date;
}

export class CreateOrderItemDto {
  menuId: string;
  quantity: number;
}

export class OrderDto {
  orderId: string;
  orderNumber: string;
  orderList: OrderItem[];
  user: string;
  status: string;
  total: number;
  createdAt: Date;
  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
  static fromEntity(order: Order): OrderDto {
    const orderList = [];
    let total = 0;
    for (const item of order.orderItems) {
      const list = OrderListDto.fromEntity(item);
      orderList.push(list);
      total = total + item.orderPrice * item.quantity;
    }
    return new OrderDto({
      orderId: order.id,
      orderNumber: order.orderNumber,
      user: order.user.fullName,
      orderList: order.orderItems ? orderList : null,
      status: order.status,
      total: total,
      createdAt: order.createdAt,
    });
  }
}

export class OrderListDto {
  menu: string;
  price: number;
  quantity: number;
  subTotal: number;
  constructor(partial: Partial<OrderListDto>) {
    Object.assign(this, partial);
  }
  static fromEntity(orderList: OrderItem): OrderListDto {
    return new OrderListDto({
      menu: orderList.menu.name,
      price: +orderList.orderPrice,
      quantity: +orderList.quantity,
      subTotal: orderList.orderPrice * orderList.quantity,
    });
  }
}
