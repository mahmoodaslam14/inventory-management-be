import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdUpdate1748860628071 implements MigrationInterface {
    name = 'UserIdUpdate1748860628071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_3200b5fed39d52a5c6e9416fbbb"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "userId" TO "id"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "PK_d72ea127f30e21753c9e229891e" TO "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER SEQUENCE "user_userId_seq" RENAME TO "user_id_seq"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "PK_429540a50a9f1fbf87efd047f35"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "PK_bebc9158e480b949565b4dc7a82"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "userUserId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "PK_429540a50a9f1fbf87efd047f35" PRIMARY KEY ("productId")`);
        await queryRunner.query(`ALTER SEQUENCE "user_id_seq" RENAME TO "user_userId_seq"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "PK_d72ea127f30e21753c9e229891e"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_3200b5fed39d52a5c6e9416fbbb" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
