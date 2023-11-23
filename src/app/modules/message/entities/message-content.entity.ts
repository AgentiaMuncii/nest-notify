import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Language} from '@/app/enum/language.enum';
import {Message} from '@/app/modules/message/entities/message.entity';

@Entity({
  name: 'message_content',
})
export class MessageContent {
    @PrimaryGeneratedColumn()
      id: number;
    
    @Column({
      type: 'int',
      nullable: false,
    })
      message_id: number;

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

    @ManyToOne(() => Message, (message) => message.id)
    @JoinColumn({name: 'message_id'})
      message_entity: Message;
}