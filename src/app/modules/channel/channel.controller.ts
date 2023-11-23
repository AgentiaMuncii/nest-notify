import {
  Body,
  Controller, DefaultValuePipe, Delete, Get,
  HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Patch,
  Post, Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import {
  ApiOkResponse,
  ApiOperation, ApiParam, ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ChannelCreatePayloadDto } from '@/app/modules/channel/dto/channel-create-payload.dto';
import {SortOrder} from '@/database/validators/typeorm.sort.validator';
import {ChannelSortColumn} from '@/app/modules/channel/validators/channel-sort-column.validator';
import {ChannelGetResponseDto} from '@/app/modules/channel/dto/channel-get-response.dto';
import PaginatorConfigInterface from '@/database/interfaces/paginator-config.interface';
import {ChannelUpdatePayloadDto} from '@/app/modules/channel/dto/channel-update-payload.dto';
import {ChannelUpdateResponseDto} from '@/app/modules/channel/dto/channel-update-response.dto';

@ApiTags('Channels')
@Controller('/channels')

export class ChannelController {
  constructor(
    private readonly channelService: ChannelService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiOkResponse({
    description: 'Added channel',
    type: ChannelCreatePayloadDto,
    isArray: true,
  })
  async create(
    @Body() createChannelDto: ChannelCreatePayloadDto,
    @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(await this.channelService.create(createChannelDto));
  }

  @Get('')
  @ApiOperation({ summary: 'Get list of channels' })
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
    enum: ChannelSortColumn,
    required: false,
  })
  @ApiQuery({
    name: 'filter[name]',
    description: 'Filter by name',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'filter[type]',
    description: 'Filter by type',
    type: 'string',
    required: false,
  })
  @ApiOkResponse({
    description: 'List of channels',
    type: ChannelGetResponseDto,
    isArray: true,
  })
  async getAllPaginated(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe)
        limit: number,
      @Query('sort_order', new DefaultValuePipe(SortOrder.DESC))
        sort_order: SortOrder,
      @Query('sort_by', new DefaultValuePipe(ChannelSortColumn.id))
        sort_by: ChannelSortColumn,
      @Res() response: Response,
  ) {
    const paginatorConfig: PaginatorConfigInterface = {
      page,
      limit
    };
    response.status(HttpStatus.OK).json(
      await this.channelService.getAllPaginated(
        paginatorConfig,
        sort_order,
        sort_by
      ),
    );
  }

  @Get(':uuid')

  @ApiOperation({ summary: 'Get one Channel by Uuid' })
  @ApiParam({ name: 'uuid', description: 'Uuid', type: 'string'})
  @ApiOkResponse({
    description: 'Channel item',
    type: ChannelGetResponseDto,
    isArray: false,
  })
  async getOneById(
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(await this.channelService.getOneByUuid(uuid));
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a channel by uuid' })
  @ApiParam({ name: 'uuid', description: 'Channel uuid', type: 'string' })
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
      .send(await this.channelService.deleteByUuid(uuid));
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a channel by uuid' })
  @ApiParam({ name: 'uuid', description: 'Channel id', type: 'string' })
  @ApiOkResponse({
    description: 'Updated channel',
    type: ChannelUpdateResponseDto,
    isArray: true,
  })
  async update(
      @Body() updateChannelDto: ChannelUpdatePayloadDto,
      @Param('uuid', ParseUUIDPipe) uuid: string,
      @Res() response: Response,
  ) {
    response
      .status(HttpStatus.OK)
      .send(
        await this.channelService.updateByUuid(uuid, updateChannelDto),
      );
  }
}
