import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({
  name: 'mail_notifications'
})
export class MailNotification {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    length: 255,
    nullable: false,
  })
    receiver_email: string;

  @Column({
    length: 255,
    nullable: false,
  })
    subject: string;

  @Column({
    nullable: false,
  })
    body: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
    created_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
    sent_at: Date;

  @Column({
    type: 'int',
    default: 0,
  })
    retry_attempts: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
    viewed_at: Date;
}