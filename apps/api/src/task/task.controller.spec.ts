import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskExistsGuard } from './guards/task-exists.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: TaskExistsGuard,
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  describe('create', () => {
    it('should call taskService.create with the createTaskDto', () => {
      const createTaskDto: CreateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
      };
      controller.create(createTaskDto);
      expect(taskService.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should call taskService.findAll', () => {
      controller.findAll();
      expect(taskService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call taskService.findOne with the id', () => {
      const id = '123';
      controller.findOne(id);
      expect(taskService.findOne).toHaveBeenCalledWith(id);
    });

    it('should have TaskExistingGuard attached', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        TaskController.prototype.findOne,
      );

      expect(guards).toBeDefined();
      expect(guards[0]).toEqual(TaskExistsGuard);
    });
  });

  describe('update', () => {
    it('should call taskService.update with the id and updateTaskDto', () => {
      const id = '123';
      const updateTaskDto: UpdateTaskDto = {
        title: 'test task - updated',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
      };
      controller.update(id, updateTaskDto);
      expect(taskService.update).toHaveBeenCalledWith(id, updateTaskDto);
    });

    it('should have TaskExistingGuard attached', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        TaskController.prototype.update,
      );

      expect(guards).toBeDefined();
      expect(guards[0]).toEqual(TaskExistsGuard);
    });
  });

  describe('remove', () => {
    it('should call taskService.remove with the id', () => {
      const id = '123';
      controller.remove(id);
      expect(taskService.remove).toHaveBeenCalledWith(id);
    });

    it('should have TaskExistingGuard attached', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        TaskController.prototype.remove,
      );

      expect(guards).toBeDefined();
      expect(guards[0]).toEqual(TaskExistsGuard);
    });
  });
});
