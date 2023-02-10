import { MigrationInterface, QueryRunner } from "typeorm";

export class addAddressCoordinatesFields1675540668602 implements MigrationInterface {
  public name = "addAddressCoordinatesFields1675540668602";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "coordinates" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
  }
}
