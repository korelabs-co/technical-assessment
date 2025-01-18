import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { TaskExistsGuard } from './guards/task-exists.guard';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskExistsGuard],
  imports: [TypeOrmModule.forFeature([Task, Product])],
})
export class TaskModule {}
