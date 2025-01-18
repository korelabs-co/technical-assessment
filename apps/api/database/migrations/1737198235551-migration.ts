import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737198235551 implements MigrationInterface {
    name = 'Migration1737198235551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_properties" ("productId" uuid NOT NULL, "properties" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cffc9e18f85a8d8173e5d835ee3" PRIMARY KEY ("productId"))`);
        await queryRunner.query(`ALTER TABLE "product_properties" ADD CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties" DROP CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3"`);
        await queryRunner.query(`DROP TABLE "product_properties"`);
    }

}
