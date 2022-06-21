import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order_item.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Menu, User, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService, MenuService, UsersService],
})
export class OrderModule {}
