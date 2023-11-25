import { Module } from '@nestjs/common';
import { NotificationInternalCrudController } from './notification-internal-crud.controller';
import { NotificationInternalService } from './notification-internal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Notification} from '@/app/modules/notification/modules/internal/entities/notification.entity';
import {NotificationContent} from '@/app/modules/notification/modules/internal/entities/notification-content.entity';
import {NotificationReceiver} from '@/app/modules/notification/modules/internal/entities/notification-receiver.entity';
import {
  NotificationInternalReceiverController
} from '@/app/modules/notification/modules/internal/notification-internal-receiver.controller';
import {EventsGateway} from '@/app/services/events-gateway/events.gateway';
import {
  NotificationInternalEventsController
} from '@/app/modules/notification/modules/internal/notification-internal-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationContent, NotificationReceiver])],
  exports: [TypeOrmModule, NotificationInternalService],
  controllers: [
    NotificationInternalCrudController,
    NotificationInternalReceiverController,
    NotificationInternalEventsController
  ],
  providers: [
    NotificationInternalService,
    EventsGateway
  ],
})
export class NotificationInternalModule {}
