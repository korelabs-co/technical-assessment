import { ProductProperties } from '../../src/product/entities/product-properties.entity';
import { Product } from '../../src/product/entities/product.entity';
import { DataSource } from 'typeorm';

require('dotenv').config({ path: './.env' });

const db = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['../**/*.{entity,view}.{js,ts}'],
});

const migrateProperties = async () => {
  console.log(`Seeding...`);

  await db.initialize();

  try {
    const products = await db
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.properties IS NOT NULL')
      .getMany();

    console.log(`Found ${products.length} products with properties to migrate`);

    for (const product of products) {
      const properties = new ProductProperties();
      properties.productId = product.id;
      properties.properties = product.properties;

      await db.getRepository(ProductProperties).save(properties);
      console.log(`Migrated properties for product ${product.id}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await db.destroy();
  }
};

migrateProperties();
