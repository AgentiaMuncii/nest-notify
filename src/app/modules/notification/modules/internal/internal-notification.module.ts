import { Module } from '@nestjs/common';
import { InternalNotificationCrudController } from './internal-notification-crud.controller';
import { InternalNotificationService } from './internal-notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {InternalNotification} from '@/app/modules/notification/modules/internal/entities/internal-notification.entity';
import {InternalNotificationTranslation} from '@/app/modules/notification/modules/internal/entities/internal-notification-translation.entity';
import {InternalNotificationReceiver} from '@/app/modules/notification/modules/internal/entities/internal-notification-receiver.entity';
import {
  InternalNotificationReceiverController
} from '@/app/modules/notification/modules/internal/internal-notification-receiver.controller';
import {EventsGateway} from '@/app/services/events-gateway/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([InternalNotification, InternalNotificationTranslation, InternalNotificationReceiver])],
  exports: [TypeOrmModule, InternalNotificationService],
  controllers: [
    InternalNotificationCrudController,
    InternalNotificationReceiverController
  ],
  providers: [
    InternalNotificationService,
    EventsGateway
  ],
})
export class InternalNotificationModule {}
