import {Body, Controller, Delete, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {
  TelegramNotificationService
} from '@/app/modules/notification/modules/telegram/telegram-notification.service';
import {ApiOkResponse, ApiOperation, ApiParam, ApiTags} from '@nestjs/swagger';
import {
  TelegramNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-payload.dto';
import {Response} from 'express';
import {
  TelegramNotificationCreateResponseDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-response.dto';
import {Language} from '@/app/enum/language.enum';

@Controller('notifications/telegram')
@ApiTags('Notifications Telegram')
export class NotificationTelegramEventsController {
  constructor(
        private readonly notificationService: TelegramNotificationService
  ) {
  }

  @Post('subscribe/:receiver_uuid/:language')
  @ApiOperation({ summary: 'Subscribe to telegram notifications' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })
  @ApiParam({ name: 'language', description: 'Receiver uuid', type: 'string' })
  async subscribe(
      @Param('receiver_uuid') receiver_uuid: string,
      @Param('language') language: Language,
      @Res() response: Response
  ) {
    response.status(HttpStatus.CREATED).send(await this.notificationService.subscribe(receiver_uuid, language));
  }

  @Delete('unsubscribe/:receiver_uuid')
  @ApiOperation({ summary: 'UnSubscribe from telegram notifications' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })
  async unsubscribe(
      @Param('receiver_uuid') receiver_uuid: string,
      @Res() response: Response
  ) {
    response.status(HttpStatus.OK).send(await this.notificationService.unsubscribe(receiver_uuid));
  }

  @Post()
  @ApiOperation({ summary: 'Create new telegram notification' })
  @ApiOkResponse({
    description: 'Created notifications',
    type: TelegramNotificationCreateResponseDto,
    isArray: true
  })
  async createNotification(
      @Body() notificationCreatePayloadDto: TelegramNotificationCreatePayloadDto,
      @Res() response: Response,
  ) {
    response
      .status(HttpStatus.CREATED)
      .send(await this.notificationService.createNotification(notificationCreatePayloadDto));
  }
}