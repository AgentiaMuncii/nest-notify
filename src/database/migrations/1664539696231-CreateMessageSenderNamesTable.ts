import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreateMessageSenderNamesTable1664539696231 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'message_sender_names',
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
      'message_sender_names',
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
    await queryRunner.dropTable('message_sender_names');
    await queryRunner.dropForeignKey('message_sender_names', 'message_sender_fk');
  }
}
