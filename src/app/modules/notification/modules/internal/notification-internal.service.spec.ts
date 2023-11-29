import {NotificationInternalService} from '@/app/modules/notification/modules/internal/notification-internal.service';
import {Test, TestingModule} from '@nestjs/testing';

describe('NotificationInternalService', () => {
  let service: NotificationInternalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationInternalService],
    }).compile();

    service = module.get<NotificationInternalService>(NotificationInternalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});