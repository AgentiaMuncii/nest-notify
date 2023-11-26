import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {
  NotificationTelegramService
} from '@/app/modules/notification/modules/telegram/notification-telegram.service';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {
  TelegramNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-payload.dto';
import {Response} from 'express';

@Controller('notifications/telegram')
@ApiTags('Notifications Telegram')
export class NotificationTelegramEventsController {
  constructor(
        private readonly notificationService: NotificationTelegramService
  ) {
  }
  @Post()
  @ApiOperation({ summary: 'Create new telegram notification' })
  @ApiOkResponse({
    description: 'Created notification',
    type: TelegramNotificationCreatePayloadDto,
  })
  async createNotification(
      @Body() notificationCreatePayloadDto: TelegramNotificationCreatePayloadDto,
      @Res() response: Response,
  ) {
    response.status(HttpStatus.CREATED).send(await this.notificationService.sendPushNotification(notificationCreatePayloadDto));
  }
}