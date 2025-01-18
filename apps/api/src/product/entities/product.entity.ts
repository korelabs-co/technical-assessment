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
import { Expose, Transform } from 'class-transformer';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.product)
  tasks: Task[];

  @OneToOne(() => ProductProperties, (properties) => properties.product, {
    cascade: ['remove'],
  })
  @Expose({ name: 'properties' })
  @Transform(({ value }) => (value ? value.properties : {}))
  productProperties: ProductProperties;
}
