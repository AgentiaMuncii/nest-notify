import {Module} from '@nestjs/common';
import {TelegrafModule} from 'nestjs-telegraf';
import { NotificationTelegramEventsService } from './notification-telegram-events.service';
import {
  NotificationTelegramEventsController
} from '@/app/modules/notification/modules/telegram/notification-telegram.controller';
import {NotificationTelegramService} from '@/app/modules/notification/modules/telegram/notification-telegram.service';
import AppConfig from '@/config/app-config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  TelegramReceiverMatchingEntity
} from '@/app/modules/notification/modules/telegram/entities/telegram-receiver-matching.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramReceiverMatchingEntity]),
    TelegrafModule.forRoot({
      token: AppConfig.telegram.botToken,
    })
  ],
  exports: [TypeOrmModule, NotificationTelegramService],
  controllers: [NotificationTelegramEventsController],
  providers: [NotificationTelegramEventsService, NotificationTelegramService],
})
export class NotificationTelegramModule {}
