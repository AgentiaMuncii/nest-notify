import {
  Inject,
  Injectable, Logger, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import { Message} from './entities/message.entity';
import { MessageCreatePayloadDto } from './dto/message-create-payload.dto';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import {IPaginationOptions, paginate, paginateRaw, Pagination} from 'nestjs-typeorm-paginate';
import {SortOrder} from '@/database/validators/typeorm.sort.validator';
import {MessageSortColumn} from '@/app/modules/message/validators/message-sort-column.validator';
import {MessageCreateResponseDto} from '@/app/modules/message/dto/message-create-response.dto';
import {MessageGetResponseDto} from '@/app/modules/message/dto/message-get-response.dto';
import {MessageUpdatePayloadDto} from '@/app/modules/message/dto/message-update-payload.dto';
import {MessageUpdateResponseDto} from '@/app/modules/message/dto/message-update-response.dto';
import {MessageContent} from '@/app/modules/message/entities/message-content.entity';
import {MessageSenderName} from '@/app/modules/message/entities/message-sender-name.entity';
import {MessageReceiver} from '@/app/modules/message/entities/message-receiver.entity';
import {ChannelService} from '@/app/modules/channel/channel.service';
import {Language} from '@/app/enum/language.enum';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly dateSource: DataSource,
    @Inject(ChannelService)
    private readonly channelService: ChannelService
  ) {}

  async create(
    message: MessageCreatePayloadDto
  ): Promise<MessageCreateResponseDto> {
    const messageEntity = plainToInstance(Message, message);
    messageEntity.uuid = uuidv4();
    const queryRunner = this.dateSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let addedMessage: MessageCreateResponseDto = null;
    try {
      addedMessage = await queryRunner.manager.save(Message, messageEntity);
      for (const messageContent of messageEntity.content) {
        messageContent.message_id = messageEntity.id;
        await queryRunner.manager.save(MessageContent, messageContent);
      }

      for (const messageSenderName of messageEntity.sender_names) {
        messageSenderName.message_id = messageEntity.id;
        await queryRunner.manager.save(MessageSenderName, messageSenderName);
      }

      for (const messageReceiver of message.receivers) {
        const messageReceiverEntity: MessageReceiver = {
          id: null,
          message_id: messageEntity.id,
          channel_id: await this.channelService.getIdByUuid(messageReceiver.channel_uuid),
          receiver_uuid: messageReceiver.uuid,
          message: null,
          channel_entity: null,
        };
        await queryRunner.manager.save(MessageReceiver, messageReceiverEntity);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return addedMessage;
  }

  private setLanguage(language: Language): string {
    if(language === Language.EN) {
      return 'EN';
    }
    if(language === Language.RO) {
      return 'RO';
    }
    if(language === Language.RU) {
      return 'RU';
    }
    return 'EN';
  }

  async getUnread(
    options: IPaginationOptions,
    language: Language
  ): Promise<Pagination<MessageGetResponseDto>> {
    try {
      const queryBuilder = this.messageRepository
        .createQueryBuilder('messages')
        .select('messages.id', '*')
        .select('messages.uuid', 'uuid')
        .innerJoin(MessageReceiver, 'receiver', 'receiver.message_id = messages.id AND receiver.viewed_at IS NULL')
        .addSelect('receiver.sent_at', 'sent_at')
        .addSelect('receiver.viewed_at', 'viewed_at')
        .innerJoin(
          MessageContent,
          'content',
          `content.message_id = messages.id AND content.language = '${this.setLanguage(language)}'`
        )
      //todo escape language
        .addSelect('content.subject', 'subject')
        .addSelect('content.body', 'body')
        .skip((Number(options.page) -1) * Number(options.limit))
        .orderBy('receiver.sent_at', 'ASC')
        .take(Number(options.limit))
      ;

      return await paginateRaw(queryBuilder, options);
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async getAllPaginated(
    options: IPaginationOptions,
    sort_order: SortOrder,
    sort_by: MessageSortColumn
  ): Promise<Pagination<MessageGetResponseDto>> {

    try {
      const queryBuilder = this.messageRepository
        .createQueryBuilder('messages')
        .select([
          'messages.sender_uuid',
          'messages.uuid',
        ])
        .orderBy(sort_by, sort_order)
        .skip(Number(options.page) * Number(options.limit))
        .take(Number(options.limit))
      ;
      Logger.log(queryBuilder.getSql());
      return await paginate<Message>(queryBuilder, options);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getOneByUuid(uuid: string): Promise<MessageGetResponseDto> {
    try {
      const message = await this.messageRepository.findOneOrFail({
        where: [{ uuid }],
      });
      console.log(plainToInstance(MessageGetResponseDto, message));
      return plainToInstance(MessageGetResponseDto, message);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async deleteByUuid(uuid: string): Promise<void> {
    try {
      await this.messageRepository.delete({
        uuid,
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async updateByUuid(uuid: string, message: MessageUpdatePayloadDto): Promise<MessageUpdateResponseDto> {
    try {
      const channelEntity = plainToInstance(Message, message);
      channelEntity.uuid = uuid;
      const existingChannel = await this.messageRepository.findOneOrFail({
        where: [{ uuid }],
      });
      await this.messageRepository.update(existingChannel, channelEntity);
      return plainToInstance(MessageUpdateResponseDto, channelEntity);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async truncate() {
    await this.messageRepository.query('TRUNCATE TABLE messages CASCADE;');
  }
}
