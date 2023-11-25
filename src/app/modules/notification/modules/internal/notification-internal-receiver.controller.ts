import {
  Controller, DefaultValuePipe, Get,
  HttpStatus, Param, ParseIntPipe, ParseUUIDPipe,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { NotificationInternalService } from './notification-internal.service';
import {
  ApiOkResponse,
  ApiOperation, ApiParam, ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import PaginatorConfigInterface from '@/database/interfaces/paginator-config.interface';
import {NotificationGetResponseDto} from '@/app/modules/notification/modules/internal/dto/notification-get-response.dto';
import {Language} from '@/app/enum/language.enum';

@ApiTags('Notifications Internal Receiver')
@Controller('notifications/internal/own')

export class NotificationInternalReceiverController {
  constructor(
    private readonly messageService: NotificationInternalService
  ) {}

  @Get(':receiver_uuid')
  @ApiOperation({ summary: 'Get all own receiver internal notifications' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Page size',
    type: 'number',
    required: false,
  })
  @ApiOkResponse({
    description: 'List of notifications',
    type: NotificationGetResponseDto,
    isArray: true,
  })
  async getAllByReceiver(
      @Param('receiver_uuid', ParseUUIDPipe) receiver_uuid: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe)
        limit: number,
      @Query('language', new DefaultValuePipe(Language.EN))
        language: Language,
      @Res() response: Response,
  ) {
    const paginatorConfig: PaginatorConfigInterface = {
      page,
      limit
    };
    response.status(HttpStatus.OK).json(
      await this.messageService.getAllPaginatedByReceiver(
        receiver_uuid,
        language,
        paginatorConfig
      ),
    );
  }

  @Get(':receiver_uuid/unread')
  @ApiOperation({ summary: 'Get unread own receiver internal notifications' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Page size',
    type: 'number',
    required: false,
  })

  @ApiOkResponse({
    description: 'List of notifications',
    type: NotificationGetResponseDto,
    isArray: true,
  })
  async getUnreadByReceiver(
      @Param('receiver_uuid', ParseUUIDPipe) receiver_uuid: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe)
        limit: number,
      @Query('language', new DefaultValuePipe(Language.EN))
        language: Language,
      @Res() response: Response,
  ) {
    const paginatorConfig: PaginatorConfigInterface = {
      page,
      limit
    };
    response.status(HttpStatus.OK).json(
      await this.messageService.getUnreadPaginatedByReceiver(
        receiver_uuid,
        language,
        paginatorConfig
      ),
    );
  }

  @Get(':receiver_uuid/notifications/:notification_uuid')
  @ApiOperation({ summary: 'Get a specified internal notification for a receiver' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })
  @ApiParam({ name: 'notification_uuid', description: 'Notification uuid', type: 'string' })
  @ApiOkResponse({
    description: 'Notification details',
    type: NotificationGetResponseDto,
    isArray: true,
  })
  async getOneByReceiver(
      @Param('receiver_uuid', ParseUUIDPipe) receiver_uuid: string,
      @Param('notification_uuid', ParseUUIDPipe) notification_uuid: string,
      @Query('language', new DefaultValuePipe(Language.EN))
        language: Language,
      @Res() response: Response,
  ) {
    response.status(HttpStatus.OK).json(
      await this.messageService.getOneByReceiver(
        receiver_uuid,
        notification_uuid,
        language
      ),
    );
  }

  @Get(':receiver_uuid/notifications/:notification_uuid/confirm-read')
  @ApiOperation({ summary: 'Confirmation about read of specific notification by a receiver' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })
  @ApiParam({ name: 'notification_uuid', description: 'Notification uuid', type: 'string' })
  @ApiOkResponse({
    description: 'Uuid of confirmed notification',
    type: NotificationGetResponseDto,
    isArray: true,
  })
  async confirmReadByReceiver(
      @Param('receiver_uuid', ParseUUIDPipe) receiver_uuid: string,
      @Param('notification_uuid', ParseUUIDPipe) notification_uuid: string,
      @Res() response: Response,
  ) {
    response.status(HttpStatus.OK).json(
      await this.messageService.confirmReadByReceiver(
        receiver_uuid,
        notification_uuid
      ),
    );
  }

  @Get(':receiver_uuid/unread-count')
  @ApiOperation({ summary: 'Amount of unread notification and datetime of last added notification' })
  @ApiParam({ name: 'receiver_uuid', description: 'Receiver uuid', type: 'string' })

  @ApiOkResponse({
    description: 'Amount of unread notification and datetime of last added notification',
    type: NotificationGetResponseDto,
    isArray: true,
  })
  async getUnreadCount(
      @Param('receiver_uuid', ParseUUIDPipe) receiver_uuid: string,
      @Res() response: Response,
  ) {
    response.status(HttpStatus.OK).json(
      await this.messageService.getUnreadCountByReceiver(
        receiver_uuid
      ),
    );
  }
}
