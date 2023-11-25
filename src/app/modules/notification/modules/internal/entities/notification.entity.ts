import {
  Column, CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import {NotificationContent} from '@/app/modules/notification/modules/internal/entities/notification-content.entity';
import {NotificationReceiver} from '@/app/modules/notification/modules/internal/entities/notification-receiver.entity';
import {ChannelType} from '@/app/modules/notification/enum/channel-type.enum';


@Entity({
  name: 'notifications'
})
export class Notification {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    length: 36,
    unique: true,
    nullable: false,
  })
    uuid: string;

  @Column({
    length: 36,
    unique: true,
    nullable: false,
  })
    sender_uuid: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @OneToMany(() =>  NotificationContent, (notificationContent) => notificationContent.notification)
    content: NotificationContent[];

  @Column({
    nullable: false,
  })
    channel_type: ChannelType;

  @OneToMany(() => NotificationReceiver, (notificationReceiver) => notificationReceiver.notification)
    receivers: NotificationReceiver[];
}
