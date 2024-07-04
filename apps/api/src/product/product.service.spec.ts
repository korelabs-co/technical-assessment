import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(Product);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: repositoryToken,
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

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.save with the createProductDto', () => {
      const createProductDto: CreateProductDto = {
        name: 'test product',
      };
      service.create(createProductDto);
      expect(repository.save).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should call repository.find', () => {
      service.findAll();
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call repository.findOneBy with the id', () => {
      const id = '123';
      service.findOne(id);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should call repository.save with the updated product', () => {
      const id = '123';
      const updateProductDto: UpdateProductDto = {
        name: 'test product - updated'
      };
      service.update(id, updateProductDto);
      expect(repository.save).toHaveBeenCalledWith({ ...updateProductDto, id });
    });
  });

  describe('remove', () => {
    it('should call repository.delete with the id', () => {
      const id = '123';
      service.remove(id);
      expect(repository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
