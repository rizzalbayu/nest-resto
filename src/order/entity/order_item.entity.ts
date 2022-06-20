import { type } from 'os';
import { Menu } from 'src/menu/entities/menu.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: new Date(),
  })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: string;

  @Column({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date;

  @Column({ name: 'version', default: 1, nullable: true })
  version: number;

  @JoinColumn({ name: 'order_id' })
  @ManyToOne((type) => Order)
  order: Order;

  @JoinColumn({ name: 'menu_id' })
  @ManyToOne((type) => Menu)
  menu: Menu;

  @Column({ name: 'order_price' })
  orderPrice: number;

  @Column({ name: 'quantity' })
  quantity: number;
}
