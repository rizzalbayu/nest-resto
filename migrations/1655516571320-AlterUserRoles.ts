import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserRoles1655516571320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role',
        type: 'varchar',
        length: '255',
        default: "'USER'",
        isNullable: false,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'phone_number',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'phone_number');
    await queryRunner.dropColumn('users', 'role');
  }
}
