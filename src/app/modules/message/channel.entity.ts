import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import {ChannelType} from '@/app/modules/channel/enum/channel-type.enum';


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

}
