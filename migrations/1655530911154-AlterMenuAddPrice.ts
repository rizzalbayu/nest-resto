import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterMenuAddPrice1655530911154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('menu', [
      new TableColumn({
        name: 'price',
        type: 'decimal',
        length: '13,2',
        isNullable: false,
      }),
      new TableColumn({
        name: 'original_price',
        type: 'decimal',
        length: '13,2',
        isNullable: false,
      }),
      new TableColumn({
        name: 'is_active',
        type: 'bit',
        length: '1',
        default: 1,
        isNullable: false,
      }),
      new TableColumn({
        name: 'image',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['FOOD', 'DRINK', 'OTHER'],
        default: "'OTHER'",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumns('menu', [
      'price',
      'original_price',
      'is_active',
      'image',
      'type',
    ]);
  }
}
