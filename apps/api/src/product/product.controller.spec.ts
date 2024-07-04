import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should call productService.create with the createProductDto', () => {
      const createProductDto: CreateProductDto = {
        name: 'test product',
      };
      controller.create(createProductDto);
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should call productService.findAll', () => {
      controller.findAll();
      expect(productService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call productService.findOne with the id', () => {
      const id = '123';
      controller.findOne(id);
      expect(productService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call productService.update with the id and updateProductDto', () => {
      const id = '123';
      const updateProductDto: UpdateProductDto = {
        name: 'test product - updated',
      };
      controller.update(id, updateProductDto);
      expect(productService.update).toHaveBeenCalledWith(id, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should call productService.remove with the id', () => {
      const id = '123';
      controller.remove(id);
      expect(productService.remove).toHaveBeenCalledWith(id);
    });
  });
});
