import { ApiProperty } from '@nestjs/swagger';
import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class MessageCreateResponseDto {
  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID' })
    sender_uuid: string;
}
