import {NotificationInternalService} from './notification-internal.service';
import {Test, TestingModule} from '@nestjs/testing';
import {DataSource, IsNull, Repository} from 'typeorm';
import {NotificationReceiver} from './entities/notification-receiver.entity';
import {Notification} from './entities/notification.entity';
import {EventEmitter2} from '@nestjs/event-emitter';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ChannelType} from '@/app/modules/notification/enum/channel-type.enum';
import {InternalServerErrorException, NotFoundException} from '@nestjs/common';

describe('NotificationInternalService', () => {
  let notificationInternalService: NotificationInternalService;

  let notificationReceiverRepository: Repository<NotificationReceiver>;
  let notificationRepository: Repository<Notification>;
  let dataSourceMock: DataSource;
  let eventEmmiter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationInternalService,
        {
          provide: EventEmitter2,
          useValue: jest.fn()
        },
        {
          provide: DataSource,
          useValue: jest.fn()
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            findAndCount: jest.fn(),
            findOneOrFail: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(NotificationReceiver),
          useValue: {
            findAndCount: jest.fn(),
            findOneOrFail: jest.fn(),
            save: jest.fn()
          }
        },
      ],
    }).compile();

    eventEmmiter = module.get(EventEmitter2);
    dataSourceMock = module.get(DataSource);
    notificationReceiverRepository = module.get(getRepositoryToken(NotificationReceiver));
    notificationRepository = module.get(getRepositoryToken(Notification));

    notificationInternalService = module.get(NotificationInternalService);
  });

  it('should be defined', () => {
    expect(notificationInternalService).toBeDefined();
  });

  describe('confirmReadByReceiver', () => {
    it('should get notification and receiver then save', async () => {
      const findNotificationSpy = jest.spyOn(notificationRepository, 'findOneOrFail');
      const findReceiverSpy = jest.spyOn(notificationReceiverRepository, 'findOneOrFail');
      const saveReceiverSpy = jest.spyOn(notificationReceiverRepository, 'save');

      const receiverMock = {
        id: 0,
        notification_id: 0,
        receiver_uuid: 'receiver-uuid',
        sent_at: '2022-01-01',
        viewed_at: '2022-01-01',
        confirm_view_at: '2022-01-01'
      };

      const notificationMock = {
        id: 0,
        uuid: 'uuid',
        sender_uuid: 'sender-uuid',
        created_at: '2022-01-01',
        channel_type: ChannelType.Internal,
      };

      findNotificationSpy.mockReturnValueOnce(Promise.resolve(notificationMock as any));
      findReceiverSpy.mockReturnValueOnce(Promise.resolve(receiverMock as any));

      jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));

      await notificationInternalService.confirmReadByReceiver('receiver-uuid', 'notification-uuid');

      expect(findNotificationSpy).toBeCalledWith({ where: { uuid: 'notification-uuid' } });

      expect(findReceiverSpy).toBeCalledWith({
        where: {
          notification_id: 0,
          receiver_uuid: 'receiver-uuid',
          confirm_view_at: IsNull()
        }
      });

      expect(saveReceiverSpy).toBeCalledWith({...receiverMock, confirm_view_at: new Date('2024-01-01')});
    });

    it('should throw not found exception on error', async () => {
      const findNotificationSpy = jest.spyOn(notificationRepository, 'findOneOrFail');

      findNotificationSpy.mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      try {
        await notificationInternalService.confirmReadByReceiver('receiver-uuid', 'notification-uuid');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});