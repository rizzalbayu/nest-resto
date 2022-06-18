import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({
    name: 'is_active',
    type: 'bit',
    transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v },
  })
  isActive: boolean;

  @Column({ name: 'password' })
  password: string;

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

  @Column({ name: 'role', default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'phone_number' })
  phoneNumber: string;
}
