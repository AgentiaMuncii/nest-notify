import { ApiProperty } from '@nestjs/swagger';
import {IsArray, Length} from 'class-validator';
import {Language} from '@/app/enum/language.enum';

export class NotificationTranslationDto {
    @ApiProperty({ example: 'en', description: 'Language' })
      language: Language;

    @ApiProperty({ example: 'Subject', description: 'Subject' })
      subject: string;

    @ApiProperty({ example: 'Body', description: 'Body' })
      body: string;
}
export class InternalNotificationCreatePayloadDto {
  @ApiProperty({ example: '74326f56-16ca-49dd-9679-deb992d5534d', description: 'Sender Uuid' })
  @Length(36, 36,{
    message: 'Sender Uuid must contain $constraint1 characters',
  })
    sender_uuid: string;

  @ApiProperty({
    example: '',
    description: 'Notification translations',
    name: 'translations'
  })
  @IsArray()
    translations: NotificationTranslationDto[];
  @ApiProperty({
    example: '',
    description: 'Notification receivers',
    name: 'receivers'
  })
  @IsArray()
    receivers: string[];

}
