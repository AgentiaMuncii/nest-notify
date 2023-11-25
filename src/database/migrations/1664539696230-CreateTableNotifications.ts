import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ChannelType } from '@/app/modules/notification/enum/channel-type.enum';

export class CreateTableNotifications1664539696230 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
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
            name: 'uuid',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'channel_type',
            type: 'enum',
            enum: [
              ChannelType.Internal,
              ChannelType.Email,
              ChannelType.Telegram,
              ChannelType.SMS
            ],
            isNullable: false,
          },
          {
            name: 'sender_uuid',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          }
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
