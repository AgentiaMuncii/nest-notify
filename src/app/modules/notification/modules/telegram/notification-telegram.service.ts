import {Injectable} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import {
  TelegramNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-payload.dto';
import AppConfig from '@/config/app-config';
import {In, Repository} from 'typeorm';
import {
  TelegramReceiverMatchingEntity
} from '@/app/modules/notification/modules/telegram/entities/telegram-receiver-matching.entity';
import {InjectRepository} from '@nestjs/typeorm';
@Injectable()
export class NotificationTelegramService {
  constructor(
      @InjectRepository(TelegramReceiverMatchingEntity)
      private readonly telegramReceiverMatchingRepository: Repository<TelegramReceiverMatchingEntity>,
  ) {
  }

  async sendPushNotification(notificationCreatePayloadDto: TelegramNotificationCreatePayloadDto) {
    const bot = new Telegraf(AppConfig.telegram.botToken);
    const message = `
      <strong>${notificationCreatePayloadDto.subject}</strong>\n${notificationCreatePayloadDto.body}`;
    try {
      const matchingList = await this.telegramReceiverMatchingRepository.find({
        where: {
          receiver_uuid: In(notificationCreatePayloadDto.receivers),
        },
      });

      const chatIDs = matchingList.map((item) => item.chat_id);
      //const chatIDs = ['282525144', '897169464'];
      const response = [];
      for (const chatID of chatIDs) {
        response.push(await bot.telegram.sendMessage(chatID, message, {parse_mode: 'HTML'}));
      }
      return response;
    } catch (e) {
      return e;
    }
  }
}