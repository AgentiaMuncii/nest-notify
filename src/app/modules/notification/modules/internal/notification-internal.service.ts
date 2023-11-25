import {Injectable, NotFoundException,} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import {Notification} from './entities/notification.entity';
import {NotificationCreatePayloadDto} from './dto/notification-create-payload.dto';
import {plainToInstance} from 'class-transformer';
import {v4 as uuidv4} from 'uuid';
import {IPaginationOptions, paginateRaw, Pagination} from 'nestjs-typeorm-paginate';
import {
  NotificationCreateResponseDto
} from '@/app/modules/notification/modules/internal/dto/notification-create-response.dto';
import {
  NotificationGetResponseDto
} from '@/app/modules/notification/modules/internal/dto/notification-get-response.dto';
import {
  NotificationUpdatePayloadDto
} from '@/app/modules/notification/modules/internal/dto/notification-update-payload.dto';
import {
  NotificationUpdateResponseDto
} from '@/app/modules/notification/modules/internal/dto/notification-update-response.dto';
import {NotificationContent} from '@/app/modules/notification/modules/internal/entities/notification-content.entity';
import {NotificationReceiver} from '@/app/modules/notification/modules/internal/entities/notification-receiver.entity';
import {Language} from '@/app/enum/language.enum';
import {
  NotificationGetOneResponseDto
} from '@/app/modules/notification/modules/internal/dto/notification-get-one-response.dto';
import {ChannelType} from '@/app/modules/notification/enum/channel-type.enum';

@Injectable()
export class NotificationInternalService {
  constructor(
    @InjectRepository(Notification)
    private readonly messageRepository: Repository<Notification>,
    @InjectRepository(NotificationContent)
    private readonly messageContentRepository: Repository<NotificationContent>,
    private readonly dateSource: DataSource,

  ) {}

  async create(
    notification: NotificationCreatePayloadDto
  ): Promise<NotificationCreateResponseDto> {
    const notificationEntity = plainToInstance(Notification, notification);
    notificationEntity.uuid = uuidv4();
    notificationEntity.channel_type = ChannelType.Internal;
    const queryRunner = this.dateSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let addedNotification: NotificationCreateResponseDto = null;
    try {
      addedNotification = await queryRunner.manager.save(Notification, notificationEntity);
      for (const notificationContent of notificationEntity.content) {
        notificationContent.notification_id = notificationEntity.id;
        console.log(notificationContent);
        await queryRunner.manager.save(NotificationContent, notificationContent);
      }

      for (const notificationReceiver of notification.receivers) {
        console.log(notificationReceiver);
        const messageReceiverEntity: NotificationReceiver = {
          id: null,
          notification_id: notificationEntity.id,
          receiver_uuid: notificationReceiver,
          notification: null
        };
        await queryRunner.manager.save(NotificationReceiver, messageReceiverEntity);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return plainToInstance(NotificationCreateResponseDto ,addedNotification);
  }

  async getUnread(
    options: IPaginationOptions,
    language: Language
  ): Promise<Pagination<NotificationGetResponseDto>> {
    try {
      const queryBuilder = this.messageRepository
        .createQueryBuilder('messages')
        .select('messages.id', '*')
        .select('messages.uuid', 'uuid')
        .innerJoin(NotificationReceiver, 'receiver', 'receiver.message_id = messages.id AND receiver.viewed_at IS NULL')
        .addSelect('receiver.sent_at', 'sent_at')
        .addSelect('receiver.viewed_at', 'viewed_at')
        .innerJoin(
          NotificationContent,
          'content',
          `content.message_id = messages.id AND content.language = '${this.setLanguage(language)}'`
        )
        .addSelect('content.subject', 'subject')
        .addSelect('content.body', 'body')
        .skip((Number(options.page) -1) * Number(options.limit))
        .orderBy('receiver.sent_at', 'DESC')
        .take(Number(options.limit))
      ;

      return await paginateRaw(queryBuilder, options);
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async getAllPaginated(
    options: IPaginationOptions
  ): Promise<any> {

    try {
      const [items, count] = await this.messageRepository.findAndCount({
        relations: ['content', 'receivers'],
        skip: (Number(options.page) -1) * Number(options.limit),
        take: Number(options.limit),
        order: {
          created_at: 'DESC'
        },
      });

      return {
        items: items,
        meta: {
          itemCount: items.length,
          itemsPerPage: options.limit,
          totalItems: count,
          currentPage: options.page,
          totalPages: Math.ceil(count / Number(options.limit)),
        }
      };
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async getOneByUuid(uuid: string): Promise<any> {
    try {
      return await this.messageRepository.findOneOrFail({
        where: {
          uuid: uuid
        },
        relations: ['content', 'receivers'],

      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getOne(message_uuid: string, receiver_uuid: string): Promise<NotificationGetOneResponseDto> {
    try {
      console.log(message_uuid, receiver_uuid);
      const message = await this.messageRepository
        .createQueryBuilder('messages')
        .select('messages.uuid', 'uuid')
        .leftJoin(
          NotificationContent,
          'content',
          'content.message_id = messages.id AND content.language = \'EN\''
        )
        .addSelect('content.subject', 'subject')
        .addSelect('content.body', 'body')
        .leftJoin(
          NotificationReceiver,
          'receiver',
          'receiver.message_id = messages.id AND receiver.receiver_uuid = :receiver_uuid', {receiver_uuid: receiver_uuid}
        )
        .addSelect('receiver.sent_at', 'sent_at')
        .addSelect('receiver.viewed_at', 'viewed_at')
        .where('messages.uuid = :message_uuid', { message_uuid })
        .getRawOne()
      ;
      return plainToInstance(NotificationGetOneResponseDto, message);
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

  async updateByUuid(uuid: string, message: NotificationUpdatePayloadDto): Promise<NotificationUpdateResponseDto> {
    try {
      const channelEntity = plainToInstance(Notification, message);
      channelEntity.uuid = uuid;
      const existingChannel = await this.messageRepository.findOneOrFail({
        where: [{ uuid }],
      });
      await this.messageRepository.update(existingChannel, channelEntity);
      return plainToInstance(NotificationUpdateResponseDto, channelEntity);
    } catch (e) {
      throw new NotFoundException();
    }
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

  async truncate() {
    await this.messageRepository.query('TRUNCATE TABLE messages CASCADE;');
  }
}
