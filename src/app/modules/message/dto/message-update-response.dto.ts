import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '@/app/modules/channel/enum/channel-type.enum';
import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class MessageUpdateResponseDto {
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
