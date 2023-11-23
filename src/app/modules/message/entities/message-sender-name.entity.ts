import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Language} from '@/app/enum/language.enum';
import {Message} from '@/app/modules/message/entities/message.entity';

@Entity({
  name: 'message_sender_names',
})
export class MessageSenderName {
    @PrimaryGeneratedColumn()
      id: number;
    
    @Column({
      type: 'int',
      nullable: false,
    })
      message_id: number;

    @Column({
      length: 50,
      unique: true,
      nullable: false,
    })
      name: string;

    @Column({
      nullable: false,
    })
      language: Language;

    @ManyToOne(() => Message, (message) => message.sender_names)
    @JoinColumn({name: 'message_id'})
      message_entity: Message;
}
