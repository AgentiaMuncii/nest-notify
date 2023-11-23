import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Message} from '@/app/modules/message/entities/message.entity';
import {Channel} from '@/app/modules/channel/entities/channel.entity';

@Entity({
  name: 'message_receivers',
})
export class MessageReceiver {
    @PrimaryGeneratedColumn()
      id: number;
    
    @Column({
      type: 'int',
      nullable: false,
    })
      message_id: number;

    @Column({
      type: 'int',
      nullable: false,
    })
      channel_id: number;

    @Column({
      length: 36,
      unique: true,
      nullable: false,
    })
      receiver_uuid: string;

    @ManyToOne(() => Message, (message) => message.receivers)
    @JoinColumn({name: 'message_id'})
      message_entity: Message;

    @ManyToOne(() => Channel, (channel) => channel.id)
    @JoinColumn({name: 'channel_id'})
      channel_entity: Channel;
}
