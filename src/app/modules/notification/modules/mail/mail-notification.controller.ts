import {Body, Controller, Post} from '@nestjs/common';
import {MailNotificationService} from '@/app/modules/notification/modules/mail/mail-notification.service';
import {
  MailNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/mail/dto/mail-notification-create-payload.dto';
import {ApiTags} from '@nestjs/swagger';

@Controller('notifications/mail')
@ApiTags('Notifications Mail')
export class MailNotificationController {
  constructor(
        private readonly notificationService: MailNotificationService
  ) {
  }

  @Post()
  createNotification(@Body() notification: MailNotificationCreatePayloadDto) {
    return this.notificationService.createNotification(notification);
  }
}
