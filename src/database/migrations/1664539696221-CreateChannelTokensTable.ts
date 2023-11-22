import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';

export class CreateChannelTokensTable1664539696221 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'channel_tokens',
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
            name: 'channel_id',
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
            name: 'token',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'WriteMessage',
              'ReadOwnMessage',
              'ReadAllMessages',
              'DeleteOwnMessage',
              'DeleteAllMessages',
              'FullAccess'
            ],
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'channel_tokens',
      new TableForeignKey({
        name: 'channel_token_fk',
        columnNames: ['channel_id'],
        referencedTableName: 'channels',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('channels');
    await queryRunner.dropForeignKey('channel_tokens', 'channel_token_fk');
  }
}
