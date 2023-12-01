import {Injectable, NotFoundException,} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, IsNull, Repository} from 'typeorm';
import {Notification} from './entities/notification.entity';
import {NotificationCreatePayloadDto} from './dto/notification-create-payload.dto';
import {plainToInstance} from 'class-transformer';
import {v4 as uuidv4} from 'uuid';
import {IPaginationOptions, paginateRaw} from 'nestjs-typeorm-paginate';
import {
  NotificationCreateResponseDto
} from '@/app/modules/notification/modules/internal/dto/notification-create-response.dto';
import {NotificationContent} from '@/app/modules/notification/modules/internal/entities/notification-content.entity';
import {NotificationReceiver} from '@/app/modules/notification/modules/internal/entities/notification-receiver.entity';
import {Language} from '@/app/enum/language.enum';
import {
  NotificationGetOneResponseDto
} from '@/app/modules/notification/modules/internal/dto/notification-get-one-response.dto';
import {ChannelType} from '@/app/modules/notification/enum/channel-type.enum';
import {EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class NotificationInternalService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationReceiver)
    private readonly notificationReceiverRepository: Repository<NotificationReceiver>,
    private readonly dateSource: DataSource,
    private readonly eventEmitter: EventEmitter2
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
        await queryRunner.manager.save(NotificationContent, notificationContent);
      }

      for (const notificationReceiver of notification.receivers) {
        const messageReceiverEntity: NotificationReceiver = {
          id: null,
          notification_id: notificationEntity.id,
          receiver_uuid: notificationReceiver,
          notification: null,
          sent_at: new Date(),
          viewed_at: null,
          confirm_view_at: null
        };
        await queryRunner.manager.save(NotificationReceiver, messageReceiverEntity);
      }

      await queryRunner.commitTransaction();

      this.eventEmitter.emit('notification.internal.created', {
        receivers: notification.receivers,
        subject: notificationEntity.content[0].subject,
        uuid: notificationEntity.uuid,
      });

    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return plainToInstance(NotificationCreateResponseDto ,addedNotification);
  }

  async getAllPaginated(
    options: IPaginationOptions
  ): Promise<any> {

    try {
      const [items, count] = await this.notificationRepository.findAndCount({
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
      throw new NotFoundException();
    }
  }

  async getOne(uuid: string): Promise<any> {
    try {
      return await this.notificationRepository.findOneOrFail({
        where: {
          uuid: uuid
        },
        relations: ['content', 'receivers'],

      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getAllPaginatedByReceiver(
    receiver_uuid: string,
    language: Language,
    options: IPaginationOptions
  ): Promise<any> {

    try {
      const queryBuilder = this.notificationRepository
        .createQueryBuilder('notifications')
        .select(['notifications.uuid AS uuid', 'notifications.sender_uuid AS sender_uuid'])
        .innerJoin(
          NotificationReceiver,
          'receiver',
          'receiver.notification_id = notifications.id AND receiver.receiver_uuid = :receiver_uuid',
          {receiver_uuid: receiver_uuid}
        )
        .addSelect('receiver.sent_at', 'sent_at')
        .addSelect('receiver.viewed_at', 'viewed_at')
        .innerJoin(
          NotificationContent,
          'content',
          'content.notification_id = notifications.id AND content.language = :language ',
          {language: this.setLanguage(language)}
        )
        .addSelect('content.subject', 'subject')
        // .addSelect('content.body', 'body')
        .skip((Number(options.page) - 1) * Number(options.limit))
        .orderBy('receiver.sent_at', 'DESC')
        .take(Number(options.limit))
      ;

      return await paginateRaw(queryBuilder, options);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getUnreadPaginatedByReceiver(
    receiver_uuid: string,
    language: Language,
    options: IPaginationOptions
  ): Promise<any> {

    try {
      const queryBuilder = this.notificationRepository
        .createQueryBuilder('notifications')
        .select(['notifications.uuid AS uuid', 'notifications.sender_uuid AS sender_uuid'])
        .innerJoin(
          NotificationReceiver,
          'receiver',
          'receiver.notification_id = notifications.id AND receiver.receiver_uuid = :receiver_uuid AND receiver.viewed_at IS NULL',
          {receiver_uuid: receiver_uuid}
        )
        .addSelect('receiver.sent_at', 'sent_at')
        //.addSelect('receiver.viewed_at', 'viewed_at')
        .innerJoin(
          NotificationContent,
          'content',
          'content.notification_id = notifications.id AND content.language = :language ',
          {language: this.setLanguage(language)}
        )
        .addSelect('content.subject', 'subject')
        // .addSelect('content.body', 'body')
        .skip((Number(options.page) - 1) * Number(options.limit))
        .orderBy('receiver.sent_at', 'DESC')
        .take(Number(options.limit))
      ;

      return await paginateRaw(queryBuilder, options);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async getOneByReceiver(receiver_uuid: string, notification_uuid: string, language: Language,): Promise<NotificationGetOneResponseDto> {
    try {
      const notification = await this.notificationRepository
        .createQueryBuilder('notifications')
        .select('notifications.uuid', 'uuid')
        .innerJoin(
          NotificationContent,
          'content',
          'content.notification_id = notifications.id AND content.language = :language',
          {language: this.setLanguage(language)}
        )
        .addSelect('content.notification_id', 'notification_id')
        .addSelect('content.subject', 'subject')
        .addSelect('content.body', 'body')
        .innerJoin(
          NotificationReceiver,
          'receiver',
          'receiver.notification_id = notifications.id AND receiver.receiver_uuid = :receiver_uuid',
          {receiver_uuid: receiver_uuid}
        )
        .addSelect('receiver.sent_at', 'sent_at')
        .addSelect('receiver.viewed_at', 'viewed_at')
        .where('notifications.uuid = :notification_uuid', { notification_uuid })
        .getRawOne()
      ;

      console.log(notification);

      const notificationReceiver = await this.notificationReceiverRepository.findOne(
        {
          where: {
            notification_id: notification.notification_id,
            receiver_uuid: receiver_uuid
          }
        }
      );
      if(notificationReceiver!==null && notificationReceiver.viewed_at === null){
        notificationReceiver.viewed_at = new Date();
        await this.notificationReceiverRepository.save(notificationReceiver);
      }

      return plainToInstance(NotificationGetOneResponseDto, notification);
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async confirmReadByReceiver(receiver_uuid: string, notification_uuid: string): Promise<NotificationGetOneResponseDto> {
    try {
      const notificationId = await this.notificationRepository.findOneOrFail(
        {  where: { uuid: notification_uuid } }
      ).then(notification => notification.id);

      const notificationReceiver = await this.notificationReceiverRepository.findOneOrFail(
        {
          where: {
            notification_id: notificationId,
            receiver_uuid: receiver_uuid,
            confirm_view_at: IsNull()
          }
        }
      );

      notificationReceiver.confirm_view_at = new Date();
      await this.notificationReceiverRepository.save(notificationReceiver);
      return plainToInstance(NotificationGetOneResponseDto, notificationReceiver);

    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async getUnreadCountByReceiver(receiver_uuid: string): Promise<any> {
    try {
      const count = await this.notificationReceiverRepository.count({
        where: {
          receiver_uuid: receiver_uuid,
          viewed_at: IsNull()
        }
      });

      const lastNotification = await this.notificationReceiverRepository.findOne({
        where: {
          receiver_uuid: receiver_uuid,
        },
        order: {
          id: 'DESC'
        }
      });

      return {
        count: count,
        last_notification_sent: lastNotification.sent_at
      };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      await this.notificationRepository.findOneOrFail({
        where: [{ uuid }],
      });
      await this.notificationRepository.delete({
        uuid,
      });
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
    await this.notificationRepository.query('TRUNCATE TABLE messages CASCADE;');
  }
}
