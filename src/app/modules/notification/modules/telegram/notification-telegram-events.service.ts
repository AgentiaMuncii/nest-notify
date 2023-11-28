import {Scenes, Telegraf} from 'telegraf';
import {Ctx, Message, On, Start, Update} from 'nestjs-telegraf';
import {
  TelegramReceiverMatchingEntity
} from '@/app/modules/notification/modules/telegram/entities/telegram-receiver-matching.entity';
import {Repository} from 'typeorm';
import AppConfig from '@/config/app-config';
import {Language} from '@/app/enum/language.enum';
import {InjectRepository} from '@nestjs/typeorm';
import {I18nService} from 'nestjs-i18n';

type Context = Scenes.SceneContext;

@Update()
export class NotificationTelegramEventsService extends Telegraf{
  constructor(
      @InjectRepository(TelegramReceiverMatchingEntity)
      private readonly telegramReceiverMatchingRepository: Repository<TelegramReceiverMatchingEntity>,
      private readonly i18n: I18nService
  ) {
    super(AppConfig.telegram.botToken);
  }
    @Start()
  async onStart(@Ctx() ctx: Context) {

    try {
      const ctxCopy:any = ctx;
      const [userUuid, language] = ctxCopy.payload.split('---');
      const chatId = ctx.from.id;
      const subscriberUuid = userUuid.trim();
      
      let subscriberName = [ctx.from.first_name, ctx.from.last_name].join(' ').trim();
      const botName = ctx.botInfo.username;

      if(!subscriberName.length) {
        subscriberName = ctx.from.username.trim();
      }

      const subscriberLanguage = this.setLanguage(language);

      if(await this.telegramReceiverMatchingRepository.findOne({where: [
        {
          chat_id: chatId
        },
        {
          receiver_uuid: subscriberUuid
        }
      ]})){
        ctx.replyWithHTML(
          this.i18n.t('telegram.bot.start.already_subscribed', {
            lang: subscriberLanguage.toLowerCase()
          })
        );
      } else {
        const matchingEntity = new TelegramReceiverMatchingEntity();
        matchingEntity.language = subscriberLanguage;
        matchingEntity.chat_id = chatId;
        matchingEntity.receiver_uuid = subscriberUuid;
        await this.telegramReceiverMatchingRepository.save(matchingEntity);

        const replyMessage = this.i18n.t('telegram.bot.start.welcome_message', {
          lang: subscriberLanguage.toLowerCase(),
          args: {
            subscriberName,
            botName,
          }
        });

        await ctx.replyWithHTML(replyMessage);
      }



    }catch (e) {
      console.log('e', e);
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
