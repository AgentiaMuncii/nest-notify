import { Module } from '@nestjs/common';

import { DiscordNotificationController } from './discord-notification.controller';
import { DiscordNotificationService } from './discord-notification.service';

@Module({
  controllers: [DiscordNotificationController],
  providers: [DiscordNotificationService],
})
export class DiscordNotificationModule {}
