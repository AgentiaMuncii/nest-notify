import {Module} from '@nestjs/common';
import {NotificationMailController} from '@/app/modules/notification/modules/mail/notification-mail.controller';
import {NotificationMailService} from '@/app/modules/notification/modules/mail/notification-mail.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MailNotification} from '@/app/modules/notification/modules/mail/entities/mail-notification.entity';
import {ScheduleModule} from '@nestjs/schedule';
import MailerConfigModule from '@/app/modules/mailer/mailer-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailNotification]),
    ScheduleModule.forRoot(),
    MailerConfigModule
  ],
  controllers: [NotificationMailController],
  providers: [NotificationMailService]
})
export class NotificationMailModule {
}