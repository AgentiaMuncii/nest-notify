import {Injectable} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import {
  TelegramNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-payload.dto';
@Injectable()
export class NotificationTelegramService {

  async sendPushNotification(notificationCreatePayloadDto: TelegramNotificationCreatePayloadDto) {
    const bot = new Telegraf('');
    const message = `
      <b>${notificationCreatePayloadDto.subject}</b>${notificationCreatePayloadDto.body}: <a href="https://google.com">Open</a>`;
    try {
      return await bot.telegram.sendMessage('', message, {parse_mode: 'HTML'});
    } catch (e) {
      return e;
    }

  }

}