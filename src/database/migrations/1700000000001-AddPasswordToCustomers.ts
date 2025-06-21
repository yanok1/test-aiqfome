import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordToCustomers1700000000001 implements MigrationInterface {
  name = 'AddPasswordToCustomers1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customers"
      ADD COLUMN "password" character varying(100) NOT NULL DEFAULT ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customers"
      DROP COLUMN "password"
    `);
  }
} 