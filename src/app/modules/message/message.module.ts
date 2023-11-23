import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Message} from '@/app/modules/message/entities/message.entity';
import {ChannelService} from '@/app/modules/channel/channel.service';
import {Channel} from '@/app/modules/channel/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel])],
  exports: [TypeOrmModule, MessageService],
  controllers: [MessageController],
  providers: [
    MessageService,
    ChannelService
  ],
})
export class MessageModule {}
