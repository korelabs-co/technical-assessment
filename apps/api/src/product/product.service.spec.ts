import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductProperties } from './entities/product-properties.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(Product);
    const propertiesRepositoryToken = getRepositoryToken(ProductProperties);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: repositoryToken,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            manager: {
              transaction: jest.fn(),
            },
          },
        },
        {
          provide: propertiesRepositoryToken,
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
    it('should call repository.save with the createProductDto without properties', async () => {
      const createProductDto: CreateProductDto = {
        name: 'test product',
      };

      await service.create(createProductDto);
      expect(repository.save).toHaveBeenCalledWith(createProductDto);
    });

    it('should create transaction and properties if createProductDto contains properties', async () => {
      const createProductId = '1';
      const createProductDto: CreateProductDto = {
        name: 'test product',
        properties: { test: 'test' },
      };

      const transactionMock = {
        save: jest.fn((entity, data) => {
          if (entity === Product) {
            return Promise.resolve({ id: createProductId });
          }
          return Promise.resolve(data);
        }),
        findOne: jest.fn().mockResolvedValue(null),
      };

      (repository.manager.transaction as jest.Mock).mockImplementation(
        async (callback) => callback(transactionMock),
      );

      (repository.findOne as jest.Mock).mockResolvedValue({
        id: createProductId,
        ...createProductDto,
      });

      await service.create(createProductDto);

      // Verify transaction was used
      expect(repository.manager.transaction).toHaveBeenCalled();

      // Verify product save
      expect(transactionMock.save).toHaveBeenNthCalledWith(
        1,
        Product,
        createProductDto,
      );

      // Verify properties save
      expect(transactionMock.save).toHaveBeenNthCalledWith(
        2,
        ProductProperties,
        {
          productId: createProductId,
          properties: createProductDto.properties, // Match the actual implementation
        },
      );

      // Verify transaction findOne was called (find product properties)
      expect(transactionMock.findOne).toHaveBeenCalledWith(ProductProperties, {
        where: { productId: createProductId },
      });

      // Verify final findOne
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: createProductId },
        relations: ['tasks', 'productProperties'],
      });
    });
  });

  describe('findAll', () => {
    it('should call repository.find', () => {
      service.findAll();
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['tasks', 'productProperties'],
      });
    });
  });

  describe('findOne', () => {
    it('should call repository.findOneBy with the id', () => {
      const id = '123';
      service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['tasks', 'productProperties'],
      });
    });
  });

  describe('update', () => {
    it('should call repository.save with the updated product, if updateProductDto contains no properties', () => {
      const id = '123';
      const updateProductDto: UpdateProductDto = {
        name: 'test product - updated',
      };
      service.update(id, updateProductDto);
      expect(repository.save).toHaveBeenCalledWith({ ...updateProductDto, id });
    });

    it('should update product and properties, if updateProductDto contains properties', async () => {
      const id = '123';
      const updateProductDto: UpdateProductDto = {
        name: 'test product - updated',
        properties: { test: 'test-updated' },
      };

      const transactionMock = {
        save: jest.fn((entity, data) => {
          if (entity === Product) {
            return Promise.resolve({ id, ...updateProductDto });
          }
          return Promise.resolve(data);
        }),
        findOne: jest.fn().mockResolvedValue(null),
      };

      (repository.manager.transaction as jest.Mock).mockImplementation(
        async (callback) => callback(transactionMock),
      );

      (repository.findOne as jest.Mock).mockResolvedValue({
        id,
        ...updateProductDto,
      });

      await service.update(id, updateProductDto);

      // Verify transaction was used
      expect(repository.manager.transaction).toHaveBeenCalled();

      // Verify properties save (first call)
      expect(transactionMock.save).toHaveBeenNthCalledWith(
        1,
        ProductProperties,
        {
          productId: id,
          properties: updateProductDto.properties,
        },
      );

      // Verify product save (second call)
      expect(transactionMock.save).toHaveBeenNthCalledWith(2, Product, {
        ...updateProductDto,
        id,
      });

      // Verify findOne for properties was called
      expect(transactionMock.findOne).toHaveBeenCalledWith(ProductProperties, {
        where: { productId: id },
      });

      // Verify final findOne
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['tasks', 'productProperties'],
      });
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
