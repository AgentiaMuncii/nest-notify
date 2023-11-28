import {MigrationInterface, QueryRunner, Table} from 'typeorm';
import {Language} from '@/app/enum/language.enum';

export class CreateTelegramReceiversMatching1701110693633 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_receivers_matching',
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
            isNullable: false,
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
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('telegram_receivers_matching');
  }

}
