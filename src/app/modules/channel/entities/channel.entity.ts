import {
  Column, CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import {ChannelType} from '@/app/modules/channel/enum/channel-type.enum';
import {MessageReceiver} from '@/app/modules/message/entities/message-receiver.entity';

@Entity({
  name: 'channels',
})
export class Channel {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    length: 36,
    unique: true,
    nullable: false,
  })
    uuid: string;

  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
    name: string;

  @Column({
    nullable: false,
  })
    type: ChannelType;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToMany(() => MessageReceiver, (messageReceiver) => messageReceiver.channel_id)
    receivers: MessageReceiver[];
}
