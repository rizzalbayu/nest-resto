import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableOrder1655687896849 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            length: '1',
            isNullable: true,
            default: 1,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'order_number',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
          }),
        ],
      }),
    );
    queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_by',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            length: '1',
            isNullable: true,
            default: 1,
          },
          {
            name: 'order_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'menu_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'order_price',
            type: 'decimal',
            length: '13,2',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_order',
            columnNames: ['order_id'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
          }),
          new TableForeignKey({
            name: 'fk_menu',
            columnNames: ['menu_id'],
            referencedTableName: 'menu',
            referencedColumnNames: ['id'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('orders');
    queryRunner.dropTable('order_items');
  }
}
