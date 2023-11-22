import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ChannelSeedService} from '@/app/modules/channel/channel.seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  exports: [TypeOrmModule, ChannelService, ChannelSeedService],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    ChannelSeedService
  ],
})
export class ChannelModule {}
