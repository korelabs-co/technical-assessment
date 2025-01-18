import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Task } from '../task/entities/task.entity';
import { ProductProperties } from './entities/product-properties.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, ProductProperties, Task])],
})
export class ProductModule {}
