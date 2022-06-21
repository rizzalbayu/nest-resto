import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterOrderAddType1655719077586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['TAKE_AWAY', 'DINE_IN'],
        default: "'TAKE_AWAY'",
        isNullable: false,
      }),
    );
    await queryRunner.addColumn(
      'order_items',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '30',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'type');
    await queryRunner.dropColumn('order_items', 'status');
  }
}
