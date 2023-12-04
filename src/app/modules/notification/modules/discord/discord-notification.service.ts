import {Injectable} from '@nestjs/common';
import * as Discord from 'discord.js';
import {
  DiscordNotificationCreatePayloadDto
} from '@/app/modules/notification/modules/discord/dto/discord-notification-create-payload.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {DiscordNotification} from '@/app/modules/notification/modules/discord/entities/discord-notification.entity';
import {Repository} from 'typeorm';
import {Language} from '@/app/enum/language.enum';

@Injectable()
export class DiscordNotificationService {
  constructor(
    @InjectRepository(DiscordNotification)
    private readonly discordNotificationRepository: Repository<DiscordNotification>
  ) {

  }

  async sendNotification(notification: DiscordNotificationCreatePayloadDto) {
    try {
      for (const notificationReceiverChannel of notification.receivers) {
        const createdNotification = await this.discordNotificationRepository.save({
          receiver_channel: notificationReceiverChannel,
          subject: notification.subject,
          body: notification.body,
          sender: notification.sender,
          language: notification.language || Language.EN
        });

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

        if(response.id){
          await this.discordNotificationRepository.update({
            id: createdNotification.id
          }, {
            sent_at: new Date()
          });
        }
        console.log('Sent', response);
      }
    } catch (e) {
      console.log('Error');
      console.log(e);
    }
  }
}
