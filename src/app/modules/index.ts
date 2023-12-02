import {InternalNotificationModule} from '@/app/modules/notification/modules/internal/internal-notification.module';
import {TelegramNotificationModule} from '@/app/modules/notification/modules/telegram/telegram-notification.module';
import {MailNotificationModule} from '@/app/modules/notification/modules/mail/mail-notification.module';

export default [
  InternalNotificationModule,
  TelegramNotificationModule,
  MailNotificationModule
];
