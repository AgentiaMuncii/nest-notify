import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class NotificationUpdatePayloadDto {
  @ApiProperty({ example: 'Name', description: 'Name' })
  @Length(3, 50, {
    message: 'Name must contain [$constraint1, $constraint2] characters',
  })
    name: string;

}