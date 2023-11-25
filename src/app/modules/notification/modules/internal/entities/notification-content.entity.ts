import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Language} from '@/app/enum/language.enum';
import {Notification} from '@/app/modules/notification/modules/internal/entities/notification.entity';

@Entity({
  name: 'notification_content',
})
export class NotificationContent {
    @PrimaryGeneratedColumn()
      id: number;
    
    @Column({
      type: 'int',
      nullable: false,
    })
      notification_id: number;

    @Column({
      nullable: false,
    })
      language: Language;

    @Column({
      length: 250,
      unique: true,
      nullable: false,
    })
      subject: string;

    @Column({
      length: 1000,
      unique: true,
      nullable: false,
    })
      body: string;

    @ManyToOne(() => Notification, (notification) => notification.content)
    @JoinColumn({name: 'notification_id'})
      notification: Notification;
}