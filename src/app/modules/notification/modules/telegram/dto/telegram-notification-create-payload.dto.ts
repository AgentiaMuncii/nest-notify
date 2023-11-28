import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsString, IsUUID, Length} from 'class-validator';

export class TelegramNotificationCreatePayloadDto {
  @ApiProperty({ example: '74326f56-16ca-49dd-9679-deb992d5534d', description: 'Sender Uuid' })
  @Length(36, 36,{
    message: 'Sender Uuid must contain $constraint1 characters',
  })
  @IsUUID()
    sender_uuid: string;

  @ApiProperty({ example: 'Subject', description: 'Subject' })
  @IsString()
    subject: string;

  @ApiProperty({ example: 'Body', description: 'Body' })
    @IsString()
    body: string;
  
  @ApiProperty({
    example: '',
    description: 'Notification receivers',
    name: 'receivers'
  })
  @IsArray()
    receivers: string[];
}
