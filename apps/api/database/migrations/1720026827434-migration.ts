import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720026827434 implements MigrationInterface {
    name = 'Migration1720026827434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_18a04c9720ea052eac80971ba48" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_18a04c9720ea052eac80971ba48"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "productId"`);
    }

}
