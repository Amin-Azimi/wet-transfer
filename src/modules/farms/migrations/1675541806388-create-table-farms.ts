import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableFarms1675541806388 implements MigrationInterface {
  public name = "createTableFarms1675541806388";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "farm" 
      ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "name" character varying NOT NULL,
       "address" character varying NOT NULL,
       "owner" character varying NOT NULL,
        "coordinates" character varying NOT NULL,
        "size" integer NOT NULL,
        "yield" integer NOT NULL,
        "distance_text" character varying NULL,
        "distance_value" integer NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "user_id" uuid, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm" ADD CONSTRAINT "FK_fe2fe67c9ca2dc03fff76cd04a9" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_fe2fe67c9ca2dc03fff76cd04a9"`);
    await queryRunner.query(`DROP TABLE "farm"`);
  }
}
