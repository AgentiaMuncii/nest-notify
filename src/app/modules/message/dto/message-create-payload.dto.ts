import { ApiProperty } from '@nestjs/swagger';
import {IsArray, Length} from 'class-validator';
import {Language} from '@/app/enum/language.enum';

export class MessageSenderNameDto{
    @ApiProperty({ example: 'en', description: 'Language' })
      language: Language;

    @ApiProperty({ example: 'Name', description: 'Name' })
      name: string;
}

export class MessageContentDto{
    @ApiProperty({ example: 'en', description: 'Language' })
      language: Language;

    @ApiProperty({ example: 'Subject', description: 'Subject' })
      subject: string;

    @ApiProperty({ example: 'Body', description: 'Body' })
      body: string;
}

class MessageReceiverDto {
  @ApiProperty({ example: '74326f56-16ca-49dd-9679-deb992d5534d', description: 'Receiver Uuid' })
  @Length(36, 36,{
    message: 'Receiver Uuid must contain $constraint1 characters',
  })
    uuid: string;

  @ApiProperty({ example: '74326f56-16ca-49dd-9679-deb992d5534d', description: 'Channel Uuid' })
  @Length(36, 36,{
    message: 'Channel Uuid must contain $constraint1 characters',
  })
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
    content: MessageContentDto[];

  @ApiProperty({
    example: '',
    description: 'Message sender names',
    name: 'sender_names',
    type: MessageSenderNameDto
  })
  @IsArray()
    sender_names: MessageSenderNameDto[];

  @ApiProperty({
    example: '',
    description: 'Message receivers',
    name: 'receivers',
    type: MessageReceiverDto
  })
  @IsArray()
    receivers: MessageReceiverDto[];
}
