import { ApiProperty } from '@nestjs/swagger';
import {IsEnum, Length} from 'class-validator';
import { ChannelType } from '@/app/modules/channel/enum/channel-type.enum';

export class ChannelCreatePayloadDto {
  @ApiProperty({ example: 'Name', description: 'Name' })
  @Length(3, 50, {
    message: 'Name must contain [$constraint1, $constraint2] characters',
  })
    name: string;

  @ApiProperty({ example: 'Internal/Mail/Telegram', description: 'Type' })
  @IsEnum(ChannelType,{
    message: 'Type must be one of ChannelType[Internal/Mail/Telegram]',
  })
    type: ChannelType;
}
