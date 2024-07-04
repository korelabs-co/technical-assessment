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
    // @fixme createTaskDto.productId is not being saved to the task
    return this._repository.save(createTaskDto);
  }

  findAll() {
    return this._repository.find();
  }

  findOne(id: string) {
    return this._repository.findOneBy({ id });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this._repository.save({ ...updateTaskDto, id });
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }
}
