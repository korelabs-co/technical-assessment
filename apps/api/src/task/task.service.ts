import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private _repository: Repository<Task>,
    @InjectRepository(Product) private _productRepository: Repository<Product>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    if (!createTaskDto.productId) {
      return this._repository.save({ ...createTaskDto });
    }

    const product = await this._productRepository.findOneBy({
      id: createTaskDto.productId,
    });
    if (product === null) {
      return null;
    }
    return this._repository.save({ ...createTaskDto, product });
  }

  findAll() {
    return this._repository.find();
  }

  findOne(id: string) {
    return this._repository.findOneBy({ id });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!updateTaskDto.productId) {
      return this._repository.save({ ...updateTaskDto, id });
    }

    const product = await this._productRepository.findOneBy({
      id: updateTaskDto.productId,
    });
    if (product === null) {
      return null;
    }
    return this._repository.save({ ...updateTaskDto, id, product });
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }
}
