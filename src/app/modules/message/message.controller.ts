import {
  Body,
  Controller, DefaultValuePipe, Delete, Get,
  HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Patch,
  Post, Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from './message.service';
import {
  ApiOkResponse,
  ApiOperation, ApiParam, ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {SortOrder} from '@/database/validators/typeorm.sort.validator';
import PaginatorConfigInterface from '@/database/interfaces/paginator-config.interface';
import {MessageCreatePayloadDto} from '@/app/modules/message/dto/message-create-payload.dto';
import {MessageSortColumn} from '@/app/modules/message/validators/message-sort-column.validator';
import {MessageGetResponseDto} from '@/app/modules/message/dto/message-get-response.dto';
import {MessageUpdateResponseDto} from '@/app/modules/message/dto/message-update-response.dto';
import {MessageUpdatePayloadDto} from '@/app/modules/message/dto/message-update-payload.dto';

@ApiTags('Messages')
@Controller('/messages')

export class MessageController {
  constructor(
    private readonly messageService: MessageService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiOkResponse({
    description: 'Message created',
    type: MessageCreatePayloadDto,
    isArray: true,
  })
  async create(
    @Body() messageCreatePayloadDto: MessageCreatePayloadDto,
    @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(await this.messageService.create(messageCreatePayloadDto));
  }

  @Get('for-receiver/:uuid')
  @ApiOperation({ summary: 'Get list of new messages for a receiver' })
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
  @ApiQuery({
    name: 'sort_order',
    description: 'Sort order',
    enum: SortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'sort_by',
    description: 'Sort column',
    enum: MessageSortColumn,
    required: false,
  })

  @ApiOkResponse({
    description: 'List of messages',
    type: MessageGetResponseDto,
    isArray: true,
  })

  async getNewForReceiver(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe)
        limit: number,
      @Query('sort_order', new DefaultValuePipe(SortOrder.DESC))
        sort_order: SortOrder,
      @Query('sort_by', new DefaultValuePipe(MessageSortColumn.id))
        sort_by: MessageSortColumn,
      @Res() response: Response,
  ) {
    const paginatorConfig: PaginatorConfigInterface = {
      page,
      limit
    };
    response.status(HttpStatus.OK).json(
      await this.messageService.getUnread(
        paginatorConfig,
        sort_order,
        sort_by
      ),
    );
  }

  @Get('')
  @ApiOperation({ summary: 'Get list of messages' })
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
  @ApiQuery({
    name: 'sort_order',
    description: 'Sort order',
    enum: SortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'sort_by',
    description: 'Sort column',
    enum: MessageSortColumn,
    required: false,
  })

  @ApiOkResponse({
    description: 'List of messages',
    type: MessageGetResponseDto,
    isArray: true,
  })
  async getAllPaginated(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe)
        limit: number,
      @Query('sort_order', new DefaultValuePipe(SortOrder.DESC))
        sort_order: SortOrder,
      @Query('sort_by', new DefaultValuePipe(MessageSortColumn.id))
        sort_by: MessageSortColumn,
      @Res() response: Response,
  ) {
    const paginatorConfig: PaginatorConfigInterface = {
      page,
      limit
    };
    response.status(HttpStatus.OK).json(
      await this.messageService.getAllPaginated(
        paginatorConfig,
        sort_order,
        sort_by
      ),
    );
  }

  @Get(':uuid')

  @ApiOperation({ summary: 'Get one message by Uuid' })
  @ApiParam({ name: 'uuid', description: 'Uuid', type: 'string'})
  @ApiOkResponse({
    description: 'Message item',
    type: MessageGetResponseDto,
    isArray: false,
  })
  async getOneById(
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(await this.messageService.getOneByUuid(uuid));
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a message by uuid' })
  @ApiParam({ name: 'uuid', description: 'Message uuid', type: 'string' })
  @ApiOkResponse({
    description: 'Empty response',
    type: null,
  })
  async delete(
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(await this.messageService.deleteByUuid(uuid));
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a message by uuid' })
  @ApiParam({ name: 'uuid', description: 'Message id', type: 'string' })
  @ApiOkResponse({
    description: 'Updated message',
    type: MessageUpdateResponseDto,
    isArray: true,
  })
  async update(
      @Body() updateMessageDto: MessageUpdatePayloadDto,
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(
        await this.messageService.updateByUuid(uuid, updateMessageDto),
      );
  }
}
