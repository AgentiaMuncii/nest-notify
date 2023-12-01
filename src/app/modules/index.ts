import {NotificationInternalModule} from '@/app/modules/notification/modules/internal/notification-internal.module';
import {NotificationTelegramModule} from '@/app/modules/notification/modules/telegram/notification-telegram.module';
import {NotificationMailModule} from '@/app/modules/notification/modules/mail/notification-mail.module';

export default [
  NotificationInternalModule,
  NotificationTelegramModule,
  NotificationMailModule
];
