import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreateMessageSenderNamesTable1664539696231 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages_sender_names',
        columns: [
          {
            name: 'message_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'language',
            type: 'enum',
            enum: [
              'EN',
              'RO',
              'RU',
              'PL'
            ],
            isNullable: false,
          }
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'messages_sender_names',
      new TableForeignKey({
        name: 'message_sender_fk',
        columnNames: ['message_id'],
        referencedTableName: 'messages',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('messages_sender_names');
    await queryRunner.dropForeignKey('messages_sender_names', 'message_sender_fk');
  }
}
