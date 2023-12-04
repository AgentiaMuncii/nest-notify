import {Module} from '@nestjs/common';
import {TelegrafModule} from 'nestjs-telegraf';
import { TelegramNotificationEventsService } from './telegram-notification-events.service';
import {
  NotificationTelegramEventsController
} from '@/app/modules/notification/modules/telegram/telegram-notification.controller';
import {TelegramNotificationService} from '@/app/modules/notification/modules/telegram/telegram-notification.service';
import AppConfig from '@/config/app-config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  TelegramNotificationReceiver
} from '@/app/modules/notification/modules/telegram/entities/telegram-notification-receiver.entity';
import {TelegramNotification} from '@/app/modules/notification/modules/telegram/entities/telegram-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramNotification, TelegramNotificationReceiver]),
    TelegrafModule.forRoot({
      token: AppConfig.telegram.botToken,
    })
  ],
  exports: [TypeOrmModule, TelegramNotificationService],
  controllers: [NotificationTelegramEventsController],
  providers: [TelegramNotificationEventsService, TelegramNotificationService],
})
export class TelegramNotificationModule {}
