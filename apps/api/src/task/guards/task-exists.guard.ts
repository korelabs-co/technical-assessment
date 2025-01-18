import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

Injectable();
export class TaskExistsGuard implements CanActivate {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const taskId = request.params.id;

    const task = await this.taskRepository.existsBy({ id: taskId });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    return true;
  }
}
