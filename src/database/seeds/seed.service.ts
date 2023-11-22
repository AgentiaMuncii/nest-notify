import { Injectable } from '@nestjs/common';
import { ChannelSeedService } from '@/app/modules/channel/channel.seed.service';

@Injectable()
export class SeedService {
  public constructor(
        private readonly channelSeedService: ChannelSeedService,
  ) { }

  public async seed(seedMethod: string, cleanInstall = false) {
    try {
      console.log(`Start seeding: ${seedMethod}...`);
      await this[seedMethod](cleanInstall);
      console.log(`Seeding complete: ${seedMethod}.`);
    } catch (e) {
      throw new Error(`Seeder ${seedMethod} not found.`);
    }
  }

  public async seedAll(cleanInstall = false) {
    await this.seed('channels', cleanInstall);
  }

  private async channels(cleanInstall = false) {
    if(cleanInstall){
      await this.channelSeedService.clean();
    }
    await this.channelSeedService.seed();
  }
}
