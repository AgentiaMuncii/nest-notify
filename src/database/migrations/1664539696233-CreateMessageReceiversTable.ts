import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreateMessageReceiversTable1664539696233 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'message_receivers',
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
            name: 'message_id',
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
            name: 'channel_id',
            type: 'int',
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
      'message_receivers',
      new TableForeignKey({
        name: 'message_receiver_fk',
        columnNames: ['message_id'],
        referencedTableName: 'messages',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'message_receivers',
      new TableForeignKey({
        name: 'message_receiver_channel_fk',
        columnNames: ['channel_id'],
        referencedTableName: 'channels',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('message_receivers');
    await queryRunner.dropForeignKey('message_receivers', 'message_receiver_fk');
    await queryRunner.dropForeignKey('message_receivers', 'message_receiver_channel_fk');
  }
}
