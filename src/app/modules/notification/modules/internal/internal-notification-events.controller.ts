import {Controller} from '@nestjs/common';
import {EventsGateway} from '@/app/services/events-gateway/events.gateway';
import {OnEvent} from '@nestjs/event-emitter';

interface INotificationInternalCreatedEvent{
  receivers: string[];
  subject: string;
  uuid: string;
}
@Controller('/notification-internal-events')
export class InternalNotificationEventsController {
  constructor(
      private readonly eventsGateway: EventsGateway
  ){}

    @OnEvent('notification.internal.created')
  notificationCreated(notification: INotificationInternalCreatedEvent) {
    for (const notificationReceiver of notification.receivers){
      this.eventsGateway.server.emit('notification.internal.created', {
        receiver: notificationReceiver,
        subject: notification.subject,
        uuid: notification.uuid,
      });
    }
  }
}