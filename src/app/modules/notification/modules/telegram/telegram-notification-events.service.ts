import {Scenes, Telegraf} from 'telegraf';
import {Ctx, Message, On, Start, Update} from 'nestjs-telegraf';
import {
  TelegramNotificationReceiver
} from '@/app/modules/notification/modules/telegram/entities/telegram-notification.receiver';
import {Repository} from 'typeorm';
import AppConfig from '@/config/app-config';
import {Language} from '@/app/enum/language.enum';
import {InjectRepository} from '@nestjs/typeorm';
import {I18nService} from 'nestjs-i18n';

type Context = Scenes.SceneContext;

@Update()
export class TelegramNotificationEventsService extends Telegraf{
  constructor(
      @InjectRepository(TelegramNotificationReceiver)
      private readonly telegramReceiverRepository: Repository<TelegramNotificationReceiver>,
      private readonly i18n: I18nService
  ) {
    super(AppConfig.telegram.botToken);
  }
  @Start()
  async onStart(@Ctx() ctx: Context) {

    try {
      const ctxCopy:any = ctx;
      const [userUuid, language, id] = ctxCopy.payload.split('---');
      const chatId = Number(ctx.from.id);
      const subscriberUuid = userUuid.trim();
      const botName = ctx.botInfo.username;
      let subscriberName = [ctx.from.first_name, ctx.from.last_name].join(' ').trim();

      if(!subscriberName.length) {
        subscriberName = ctx.from.username.trim();
      }

      const subscriberLanguage = this.setLanguage(language);

      if(await this.isAlreadySubscribed(chatId)){
        await ctx.replyWithHTML(
          this.i18n.t('telegram.bot.start.already_subscribed', {
            lang: subscriberLanguage.toLowerCase()
          })
        );

        return;
      }

      const response = await this.telegramReceiverRepository.update({
        id,
        receiver_uuid: subscriberUuid
      }, {
        chat_id: chatId,
        confirmed_at: new Date()
      });

      if (response.affected) {
        await ctx.replyWithHTML(
          this.i18n.t('telegram.bot.start.welcome_message', {
            lang: subscriberLanguage.toLowerCase(),
            args: {
              subscriberName,
              botName,
            }
          })
        );
      } else {
        await ctx.replyWithHTML(this.i18n.t('telegram.bot.start.subscriber_not_found'));
      }

    }catch (e) {
      await ctx.replyWithHTML(this.i18n.t('telegram.bot.start.error'));
    }
  }
  
    @On('text')
  onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    const replyMessage = this.i18n.t('telegram.bot.on_message.no_messages_accepted', {
      lang: 'en',
    });
    return `Hey ${ctx.from.username}, you just typed: ${message}.\n${replyMessage}`;
  }

    private async isAlreadySubscribed(chatId: number){
      return await this.telegramReceiverRepository.findOne({where: [
        {
          chat_id: chatId
        }
      ]});
    }

    private setLanguage(language: Language): Language {

      if(!language) {
        return Language.EN;
      }

      const languageUppercase = language.toUpperCase();

      if(languageUppercase === Language.EN) {
        return Language.EN;
      }

      if(languageUppercase === Language.RO) {
        return Language.RO;
      }

      if(languageUppercase === Language.RU) {
        return Language.RU;
      }

      return Language.EN;
    }
}
