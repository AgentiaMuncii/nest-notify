import {MigrationInterface, QueryRunner, Table} from 'typeorm';
import {Language} from '@/app/enum/language.enum';

export class CreateTelegramNotificationReceivers1701110693631 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_notification_receivers',
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
            name: 'receiver_uuid',
            type: 'char',
            length: '36',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'chat_id',
            type: 'int',
            isNullable: true,
            isUnique: true,
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
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true
          }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('telegram_notification_receivers');
  }

}
