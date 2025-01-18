import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { ProductProperties } from './product-properties.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  // @todo normalise properties out into their own relational table, the /products api should return in the same format
  @Column({ type: 'jsonb', nullable: true })
  properties?: Record<string, any>;

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.product)
  tasks: Task[];

  @OneToOne(() => ProductProperties, (properties) => properties.product, {
    cascade: ['remove'],
  })
  productProperties: ProductProperties;
}
