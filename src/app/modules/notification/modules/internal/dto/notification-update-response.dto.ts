import { ApiProperty } from '@nestjs/swagger';
import {Exclude, Expose} from 'class-transformer';
import {ChannelType} from '@/app/modules/notification/enum/channel-type.enum';

@Exclude()
export class NotificationUpdateResponseDto {
  @ApiProperty({ example: 'Name', description: 'Name' })
  @Expose()
    name: string;

  @ApiProperty({ example: 'Internal/Mail/Telegram', description: 'Type' })
  @Expose()
    type: ChannelType;

  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID' })
    uuid: string;
}
