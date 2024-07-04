import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720007550383 implements MigrationInterface {
    name = 'Migration1720007550383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "properties" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "properties"`);
    }

}
