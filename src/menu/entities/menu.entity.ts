import { type } from 'os';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuType } from './menu-type.enum';

@Entity({ name: 'menu' })
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

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

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'original_price' })
  originalPrice: number;

  @Column({
    name: 'is_active',
    type: 'bit',
    transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v },
  })
  isActive: boolean;

  @Column({ name: 'image' })
  image: string;

  @Column({ name: 'type', default: MenuType.OTHER })
  type: MenuType;
}
