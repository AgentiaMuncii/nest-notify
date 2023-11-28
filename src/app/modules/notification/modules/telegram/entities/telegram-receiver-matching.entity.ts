import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Language} from '@/app/enum/language.enum';

@Entity({
  name: 'telegram_receivers_matching'
})
export class TelegramReceiverMatchingEntity {
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
}
