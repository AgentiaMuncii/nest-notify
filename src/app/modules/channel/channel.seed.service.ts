import {
  Inject,
  Injectable
} from '@nestjs/common';
import { ChannelService } from '@/app/modules/channel/channel.service';
import channels from '@/database/seeds-data/channels.json';
import {ChannelCreatePayloadDto} from '@/app/modules/channel/dto/channel-create-payload.dto';
import {ChannelType} from '@/app/modules/channel/enum/channel-type.enum';

@Injectable()
export class ChannelSeedService {
  @Inject(ChannelService)
  private readonly channelService: ChannelService;

  async seed(){
    for (const channel of channels) {
      try {
        const key = channel.type as keyof typeof ChannelType;
        const createdChannel: ChannelCreatePayloadDto = {
          name: channel.name,
          type: ChannelType[key],
        };
        console.log(createdChannel);
        await this.channelService.create(createdChannel);
        console.log(`Seeded: ${JSON.stringify(channel)}`);
      }catch (e) {
        console.log(`Skipped: ${JSON.stringify(channel)}`);
      }
    }
  }

  async clean() {
    console.log('Start cleaning: channels...');
    await this.channelService.truncate();
    console.log('Cleaning complete: channels.');
  }
}
