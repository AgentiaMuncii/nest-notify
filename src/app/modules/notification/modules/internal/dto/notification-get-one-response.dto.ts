import {Exclude, Expose} from 'class-transformer';

@Exclude()
export class NotificationGetOneResponseDto {
  @Expose()
    uuid: string;

  @Expose()
    subject: string;

  @Expose()
    body: string;

  @Expose()
    sent_at: Date;

  @Expose()
    viewed_at: Date;

}
