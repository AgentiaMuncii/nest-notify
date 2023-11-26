import {Scenes, Telegraf} from 'telegraf';
import {Ctx, Message, On, Start, Update} from 'nestjs-telegraf';

type Context = Scenes.SceneContext;

@Update()
export class NotificationTelegramEventsService extends Telegraf{
    @Start()
  onStart(@Ctx() ctx: Context) {
    return ctx.replyWithHTML(`Welcome ${ctx.from.username}!`);
  }
    @On('text')
    onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
      return `Hey ${ctx.from.username}, you just typed: ${message}`;
    }
}
