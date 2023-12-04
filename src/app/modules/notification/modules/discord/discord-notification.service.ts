import { Injectable } from '@nestjs/common';
import * as Discord from 'discord.js';
import {
  DiscordNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/discord/dto/discord-notification-create-payload.dto';

@Injectable()
export class DiscordNotificationService {

  async sendNotification(notification: DiscordNotificationCreatePayloadDto) {
    try {
      for (const notificationReceiverChannel of notification.receivers) {
        const client = new Discord.WebhookClient({
          url: `https://discord.com/api/webhooks/${notificationReceiverChannel}`,
        });

        const response = await client.send({
          embeds: [{
            title: notification.subject,
            fields: [
              { name: 'Sender', value: notification.sender },
              { name: 'Message', value: notification.body }
            ]
          }],
        });

        console.log('Sent', response);
      }
    } catch (e) {
      console.log('Error');
      console.log(e);
    }
  }
}
