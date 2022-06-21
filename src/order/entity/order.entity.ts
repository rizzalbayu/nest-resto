import { type } from 'os';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.enum';
import { OrderType } from './order-type.enum';
import { OrderItem } from './order_item.entity';

@Entity({ name: 'orders' })
export class Order {
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

  @JoinColumn({ name: 'user_id' })
  @ManyToOne((type) => User)
  user: User;

  @Column({ name: 'status', default: OrderStatus.SUCCESS })
  status: OrderStatus;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert', 'update'],
  })
  orderItems: OrderItem[];

  @Column({ name: 'type' })
  type: OrderType;
}
