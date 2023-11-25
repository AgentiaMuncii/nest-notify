import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreateTableNotificationReceivers1664539696233 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_receivers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'notification_id',
            type: 'int',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'receiver_uuid',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'viewed_at',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'confirm_view_at',
            type: 'timestamp',
            isNullable: true
          }
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'notification_receivers',
      new TableForeignKey({
        name: 'notification_receiver_fk',
        columnNames: ['notification_id'],
        referencedTableName: 'notifications',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification_receivers');
    await queryRunner.dropForeignKey('notification_receivers', 'notification_receiver_fk');
  }
}
