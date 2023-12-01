import {Body, Controller, Post} from '@nestjs/common';
import {NotificationMailService} from '@/app/modules/notification/modules/mail/notification-mail.service';
import {
  MailNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/mail/dto/mail-notification-create-payload.dto';

@Controller('notifications/mail')
export class NotificationMailController {
  constructor(
        private readonly notificationService: NotificationMailService
  ) {
  }

  @Post()
  createNotification(@Body() notification: MailNotificationCreatePayloadDto) {
    return this.notificationService.createNotification(notification);
  }
}
