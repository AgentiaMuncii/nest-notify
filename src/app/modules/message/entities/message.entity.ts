import {
  Column, CreateDateColumn,
  Entity, JoinColumn, OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import {MessageSenderName} from '@/app/modules/message/entities/message-sender-name.entity';
import {MessageContent} from '@/app/modules/message/entities/message-content.entity';
import {MessageReceiver} from '@/app/modules/message/entities/message-receiver.entity';

@Entity({
  name: 'messages',
})
export class Message {
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

  @OneToMany(() => MessageSenderName, (messageSenderName) => messageSenderName.message_id)
    sender_names: MessageSenderName[];

  @OneToMany(() =>  MessageContent, (messageContent) => messageContent.message_id)
    content: MessageContent[];

  @OneToMany(() => MessageReceiver, (messageReceiver) => messageReceiver.message)
  //@JoinColumn({name: 'receivers'})
    receivers: MessageReceiver[];
}
