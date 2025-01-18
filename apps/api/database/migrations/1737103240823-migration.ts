import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737103240823 implements MigrationInterface {
    name = 'Migration1737103240823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_18a04c9720ea052eac80971ba4" ON "tasks" ("productId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_18a04c9720ea052eac80971ba4"`);
    }

}
