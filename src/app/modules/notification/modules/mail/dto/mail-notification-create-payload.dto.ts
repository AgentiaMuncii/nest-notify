import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsEmail, IsString, IsUUID} from 'class-validator';
import {Language} from '@/app/enum/language.enum';

export class MailNotificationCreatePayloadDto {
  @ApiProperty({ example: '74326f56-16ca-49dd-9679-deb992d5534d', description: 'Sender Uuid' })
  @IsUUID()
    sender_uuid: string;

  @ApiProperty({ example: 'Subject', description: 'Subject' })
  @IsString()
    subject: string;

  @ApiProperty({ example: 'Body', description: 'Body' })
    @IsString()
    body: string;

  @ApiProperty({ example: 'en', description: 'Language' })
    language: Language;
  
  @ApiProperty({
    example: '',
    description: 'Notification receivers',
    name: 'receivers'
  })
  @IsEmail({}, { each: true, message: 'Invalid email' })
  @IsArray()
    receivers: string[];
}
