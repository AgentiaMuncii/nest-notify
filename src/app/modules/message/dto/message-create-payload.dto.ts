import { ApiProperty } from '@nestjs/swagger';
import {IsArray, Length} from 'class-validator';
import {Language} from '@/app/enum/language.enum';

export interface IMessageContent {
  language: Language;
  subject: string;
  body: string;
}

export interface IMessageSenderName {
  language: Language;
  name: string;
}

export interface IMessageReceiver {
  uuid: Language;
  channel_uuid: string;
}

export class MessageCreatePayloadDto {
  @ApiProperty({ example: '74326f56-16ca-49dd-9679-deb992d5534d', description: 'Sender Uuid' })
  @Length(36, 36,{
    message: 'Sender Uuid must contain $constraint1 characters',
  })
    sender_uuid: string;

  @ApiProperty({
    example: '',
    description: 'Message content',
    name: 'content'
  })
  @IsArray()
    content: IMessageContent[];

  @ApiProperty({
    example: '',
    description: 'Message sender names',
    name: 'sender_names'
  })
  @IsArray()
    sender_names: IMessageSenderName[];

  @ApiProperty({
    example: '',
    description: 'Message receivers',
    name: 'receivers'
  })
  @IsArray()
    receivers: IMessageReceiver[];
}
