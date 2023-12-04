import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app/app.module';
//import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/notifications/internal (GET)', async () => {
  //   const appInstance = await request(app.getHttpServer())
  //     .get('/')
  //     .expect(404);
  //
  // });


  // afterAll(async () => {
  //   await app.close();
  // });

});
