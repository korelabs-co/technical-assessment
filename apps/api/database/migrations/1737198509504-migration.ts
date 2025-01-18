import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737198509504 implements MigrationInterface {
    name = 'Migration1737198509504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "properties"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "properties" jsonb`);
    }

}
