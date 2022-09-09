import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterOrderAddQueueNumber1655800592588
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'queue_number',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'queue_number');
  }
}
