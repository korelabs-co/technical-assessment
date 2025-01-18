import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let productRepository: Repository<Product>;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const taskRepositoryToken = getRepositoryToken(Task);
    const productRepositoryToken = getRepositoryToken(Product);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: taskRepositoryToken,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: productRepositoryToken,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(taskRepositoryToken);
    productRepository = module.get(productRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.save with the createTaskDto, if product is not attached', () => {
      const createTaskDto: CreateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
      };

      service.create(createTaskDto);
      expect(taskRepository.save).toHaveBeenCalledWith(createTaskDto);
    });

    it.only('should call repository.save with the createTaskDto and product, if product is attached', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
        productId: '123',
      };

      const product = {
        id: '123',
      };

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(product as Product);

      await service.create(createTaskDto);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: createTaskDto.productId,
      });
      expect(taskRepository.save).toHaveBeenCalledWith({
        ...createTaskDto,
        product,
      });
    });

    it('should return null if attached product is not found', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
        productId: '123',
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.create(createTaskDto);
      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call repository.find', () => {
      service.findAll();
      expect(taskRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should call repository.findOneBy with the id', () => {
      const id = '123';
      service.findOne(id);
      expect(taskRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should call repository.save with the updateTaskDto, if product is not attached', () => {
      const id = '123';
      const updateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
      };

      service.update(id, updateTaskDto);
      expect(taskRepository.save).toHaveBeenCalledWith({
        ...updateTaskDto,
        id,
      });
    });

    it('should call repository.save with the updateTaskDto and product, if product is attached', async () => {
      const id = '123';
      const updateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
        productId: '123',
      };

      const product = {
        id: '123',
      };

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(product as Product);

      await service.update(id, updateTaskDto);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: updateTaskDto.productId,
      });
      expect(taskRepository.save).toHaveBeenCalledWith({
        ...updateTaskDto,
        id,
        product,
      });
    });

    it('should return null if attached product is not found', async () => {
      const id = '123';
      const updateTaskDto = {
        title: 'test task',
        description: 'test tasks description',
        dueAt: new Date().toISOString(),
        productId: '123',
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.update(id, updateTaskDto);
      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call repository.delete with the id', () => {
      const id = '123';
      service.remove(id);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
