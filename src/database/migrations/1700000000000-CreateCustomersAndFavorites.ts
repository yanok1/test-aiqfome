import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersAndFavorites1700000000000
  implements MigrationInterface
{
  name = 'CreateCustomersAndFavorites1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create customers table
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(100) NOT NULL,
        "email" character varying(100) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create favorites table
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" SERIAL PRIMARY KEY,
        "customerId" integer NOT NULL,
        "productId" integer NOT NULL,
        "productTitle" character varying(200) NOT NULL,
        "productImage" character varying(500) NOT NULL,
        "productPrice" numeric(10,2) NOT NULL,
        "productRating" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_favorites_customer_product" UNIQUE ("customerId", "productId")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_customers_email" ON "customers" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_favorites_customerId" ON "favorites" ("customerId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_favorites_productId" ON "favorites" ("productId")
    `);

    // Create foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_customerId" 
      FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_customerId"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
