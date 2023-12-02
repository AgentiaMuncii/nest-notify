import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import {
  TelegramNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-payload.dto';
import AppConfig from '@/config/app-config';
import {DataSource, IsNull, LessThan, Repository} from 'typeorm';
import {
  TelegramNotificationReceiver
} from '@/app/modules/notification/modules/telegram/entities/telegram-notification.receiver';
import {InjectRepository} from '@nestjs/typeorm';
import {TelegramNotification} from '@/app/modules/notification/modules/telegram/entities/telegram-notification.entity';
import {
  TelegramNotificationCreateResponseDto
} from '@/app/modules/notification/modules/telegram/dto/telegram-notification-create-response.dto';
import {Cron, CronExpression} from '@nestjs/schedule';
import {Language} from '@/app/enum/language.enum';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class TelegramNotificationService {
  constructor(
      @InjectRepository(TelegramNotificationReceiver)
      private readonly telegramReceiverRepository: Repository<TelegramNotificationReceiver>,
      @InjectRepository(TelegramNotification)
      private readonly telegramNotificationRepository: Repository<TelegramNotification>,
      private readonly dateSource: DataSource,
  ) {
  }

  async subscribe(receiver_uuid: string, language: Language) {
    const existingSubscriber = await this.telegramReceiverRepository.findOne({
      where: {
        receiver_uuid
      }
    });
    if (existingSubscriber) {
      throw new ConflictException({
        code: 'SUBSCRIBER_ALREADY_EXISTS',
      });
    }
    try {
      const subscriberEntity = new TelegramNotificationReceiver();
      subscriberEntity.language = language;
      subscriberEntity.receiver_uuid = receiver_uuid;
      return await this.telegramReceiverRepository.save(subscriberEntity);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async unsubscribe(receiver_uuid: string) {
    return await this.telegramReceiverRepository.delete({
      receiver_uuid
    });
  }

  async createNotification(notification: TelegramNotificationCreatePayloadDto): Promise<TelegramNotificationCreateResponseDto[]> {
    const createdNotifications = [];
    const queryRunner = this.dateSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const receiver of notification.receivers) {
        const receiverMatch = await this.getChatIdByReceiverUuid(receiver);
        if (!receiverMatch) {
          continue;
        }
        const newNotification = new TelegramNotification();
        newNotification.receiver_id = receiverMatch.id;
        newNotification.subject = notification.subject;
        newNotification.body = notification.body;
        newNotification.language = receiverMatch.language;
        newNotification.retry_attempts = 1;
        const response = await this.sendPushNotification(receiverMatch.chat_id, newNotification);
        if(response && response.message_id){
          newNotification.sent_at = new Date();
        }
        const createdNotification = await queryRunner.manager.save(newNotification);
        createdNotifications.push(
          plainToInstance(TelegramNotificationCreateResponseDto, createdNotification)
        );
        await this.updateReceiverLanguage(receiverMatch.id, notification.language);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (!createdNotifications.length) {
      throw new NotFoundException({
        code: 'NO_RECEIVERS_FOUND',
      });
    }

    return createdNotifications;
  }

  private async updateReceiverLanguage(receiverId: number, language: Language) {
    await this.telegramReceiverRepository.update(receiverId, {
      language
    });
  }

  private async getChatIdByReceiverUuid(uuid: string) {
    return await this.telegramReceiverRepository.findOne({
      where: {
        receiver_uuid: uuid
      }
    });
  }

  private async sendPushNotification(chatId: number, notification: TelegramNotification) {
    const bot = new Telegraf(AppConfig.telegram.botToken);
    const message = `<strong>${notification.subject}</strong>\n${notification.body}`;
    try {
      return await bot.telegram.sendMessage(chatId, message, {parse_mode: 'HTML'});
    } catch (e) {
      return null;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  private async deleteOldSentNotifications() {
    const days = 7;
    await this.telegramNotificationRepository.delete({
      sent_at: LessThan(new Date(new Date().setDate(new Date().getDate() - days)))
    });
  }

  @Cron(CronExpression.EVERY_WEEK)
  async deleteOldUnsentNotifications() {
    const days = 30;
    await this.telegramNotificationRepository.delete({
      sent_at: IsNull(),
      created_at: LessThan(new Date(new Date().setDate(new Date().getDate() - days)))
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteOldUnconfirmedSubscribers() {
    const minutes = 5;
    await this.telegramReceiverRepository.delete({
      confirmed_at: IsNull(),
      created_at: LessThan(new Date(new Date().getTime() - (minutes * 60000)))
    });
  }
}