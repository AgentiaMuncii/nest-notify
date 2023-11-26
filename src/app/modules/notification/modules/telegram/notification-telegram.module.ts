import {Module} from '@nestjs/common';
import {TelegrafModule} from 'nestjs-telegraf';
import { NotificationTelegramEventsService } from './notification-telegram-events.service';
import {
  NotificationTelegramEventsController
} from '@/app/modules/notification/modules/telegram/notification-telegram.controller';
import {NotificationTelegramService} from '@/app/modules/notification/modules/telegram/notification-telegram.service';

@Module({
  imports: [TelegrafModule.forRoot({
    token: '6711985210:AAGgM_hMX-jgygTJyBI20HY0hM04CL953j8'
  })],
  exports: [],
  controllers: [NotificationTelegramEventsController],
  providers: [NotificationTelegramEventsService, NotificationTelegramService],
})
export class NotificationTelegramModule {}
