import {
  ConflictException,
  Injectable, Logger, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelCreatePayloadDto } from './dto/channel.create.payload.dto';
import { plainToInstance } from 'class-transformer';
import {ChannelCreateResponseDto} from '@/app/modules/channel/dto/channel.create.response.dto';
import { v4 as uuidv4 } from 'uuid';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {SortOrder} from '@/database/validators/typeorm.sort.validator';
import {ChannelSort} from '@/app/modules/channel/validators/channel.sort.validator';
import {ChannelGetResponseDto} from '@/app/modules/channel/dto/channel.get.response.dto';
import {ChannelUpdatePayloadDto} from '@/app/modules/channel/dto/channel.update.payload.dto';
import {ChannelUpdateResponseDto} from '@/app/modules/channel/dto/channel.update.response.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>
  ) {}

  async create(
    channel: ChannelCreatePayloadDto
  ): Promise<ChannelCreateResponseDto> | undefined {
    const channelEntity = plainToInstance(Channel, channel);
    channelEntity.uuid = uuidv4();
    console.log('entity', channelEntity);
    const existingChannel = await this.channelRepository.findOne({
      where: [{ name: channelEntity.name }],
    });

    if (existingChannel) {
      throw new ConflictException();
    }

    return await this.channelRepository.save(channelEntity);
  }

  async getAllPaginated(
    options: IPaginationOptions,
    sort_order: SortOrder,
    sort_by: ChannelSort
  ): Promise<Pagination<ChannelGetResponseDto>> {

    try {
      const queryBuilder = this.channelRepository
        .createQueryBuilder('channels')
        .select([
          'channels.name',
          'channels.type',
          'channels.uuid',
        ])
        .orderBy(sort_by, sort_order)
        .skip(Number(options.page) * Number(options.limit))
        .take(Number(options.limit))
      ;
      Logger.log(queryBuilder.getSql());
      return await paginate<Channel>(queryBuilder, options);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getOneByUuid(uuid: string): Promise<ChannelGetResponseDto> {
    try {
      const channel = await this.channelRepository.findOneOrFail({
        where: [{ uuid }],
      });
      console.log(plainToInstance(ChannelGetResponseDto, channel));
      return plainToInstance(ChannelGetResponseDto, channel);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async deleteByUuid(uuid: string): Promise<void> {
    try {
      await this.channelRepository.delete({
        uuid,
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async updateByUuid(uuid: string, channel: ChannelUpdatePayloadDto): Promise<ChannelUpdateResponseDto> {
    try {
      const channelEntity = plainToInstance(Channel, channel);
      channelEntity.uuid = uuid;
      const existingChannel = await this.channelRepository.findOneOrFail({
        where: [{ uuid }],
      });
      await this.channelRepository.update(existingChannel, channelEntity);
      return plainToInstance(ChannelCreateResponseDto, channelEntity);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async truncate() {
    await this.channelRepository.query('TRUNCATE TABLE channels CASCADE;');
  }
}
