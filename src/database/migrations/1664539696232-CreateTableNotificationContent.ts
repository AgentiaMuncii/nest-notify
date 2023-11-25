import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';
import {Language} from '@/app/enum/language.enum';

export class CreateTableNotificationContent1664539696232 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_content',
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
            name: 'language',
            type: 'enum',
            enum: [
              Language.EN,
              Language.RO,
              Language.RU,
              Language.PL
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
      'notification_content',
      new TableForeignKey({
        name: 'notification_content_fk',
        columnNames: ['notification_id'],
        referencedTableName: 'notifications',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification_content');
    await queryRunner.dropForeignKey('notification_content', 'notification_content_fk');
  }
}
