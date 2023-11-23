import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreateMessageContentTable1664539696232 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'message_content',
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
            name: 'language',
            type: 'enum',
            enum: [
              'EN',
              'RO',
              'RU',
              'PL'
            ],
            isNullable: false,
          },
          {
            name: 'subject',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'varchar',
            length: '1000',
            isNullable: false,
          }
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'message_content',
      new TableForeignKey({
        name: 'message_content_fk',
        columnNames: ['message_id'],
        referencedTableName: 'messages',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('message_content');
    await queryRunner.dropForeignKey('message_content', 'message_content_fk');
  }
}
