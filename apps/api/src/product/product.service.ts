import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';

type ProductWithTasks = Product & { tasks?: Task[] };

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>,
    @InjectRepository(Task) private _taskRepository: Repository<Task>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this._repository.save(createProductDto);
  }

  async findAll() {
    const products: ProductWithTasks[] = await this._repository.find();

    for (const product of products) {
      product.tasks = await this._taskRepository.find({
        where: { product: { id: product.id } },
      });
    }

    return products;
  }

  findOne(id: string) {
    return this._repository.findOneBy({ id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this._repository.save({ ...updateProductDto, id });
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }
}
