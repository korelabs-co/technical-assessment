import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { ProductProperties } from './entities/product-properties.entity';

type ProductWithTasks = Product & { tasks?: Task[] };

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private _repository: Repository<Product>,
    @InjectRepository(ProductProperties)
    private _propertiesRepository: Repository<ProductProperties>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    if (!createProductDto.properties) {
      return await this._repository.save(createProductDto);
    }

    const productId = await this._repository.manager.transaction(
      async (transaction) => {
        const product = await transaction.save(Product, createProductDto);
        await this.saveProperties(
          {
            productId: product.id,
            productProperties: createProductDto.properties,
          },
          transaction,
        );

        return product.id;
      },
    );

    return this._repository.findOne({
      where: { id: productId },
      relations: ['tasks', 'productProperties'],
    });
  }

  async findAll() {
    const products: ProductWithTasks[] = await this._repository.find({
      relations: ['tasks', 'productProperties'],
    });
    return products;
  }

  findOne(id: string) {
    return this._repository.findOne({
      where: { id },
      relations: ['tasks', 'productProperties'],
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!updateProductDto.properties) {
      return this._repository.save({ ...updateProductDto, id });
    }

    await this._repository.manager.transaction(async (transaction) => {
      await this.saveProperties(
        {
          productId: id,
          productProperties: updateProductDto.properties,
        },
        transaction,
      );
      await transaction.save(Product, { ...updateProductDto, id });
    });

    return this._repository.findOne({
      where: { id: id },
      relations: ['tasks', 'productProperties'],
    });
  }

  remove(id: string) {
    return this._repository.delete({ id });
  }

  private async saveProperties(
    {
      productId,
      productProperties,
    }: {
      productId: string;
      productProperties: Record<string, any>;
    },
    transaction: EntityManager,
  ) {
    let properties = await transaction.findOne(ProductProperties, {
      where: { productId },
    });

    if (properties) {
      properties.properties = productProperties;
      return properties;
    }

    properties = await transaction.save(ProductProperties, {
      productId,
      properties: productProperties,
    });
    return properties;
  }
}
