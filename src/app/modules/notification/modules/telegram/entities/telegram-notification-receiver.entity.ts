import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Language} from '@/app/enum/language.enum';
import {TelegramNotification} from '@/app/modules/notification/modules/telegram/entities/telegram-notification.entity';

@Entity({
  name: 'telegram_notification_receivers'
})
export class TelegramNotificationReceiver {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({
      length: 36,
      unique: true,
      nullable: false,
    })
      receiver_uuid: string;

    @Column({
      unique: true,
      nullable: false,
    })
      chat_id: number;

    @Column({
      nullable: false,
    })
      language: Language;

    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
      created_at: Date;

    @Column({
      type: 'timestamp',
      nullable: true,
    })
      confirmed_at: Date;

    @OneToMany(() => TelegramNotification, (notification) => notification.receiver)
      notifications: TelegramNotification[];
}
