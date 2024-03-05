import {
  type CallbackQueryContext,
  InlineKeyboard,
  InputFile,
  CommandContext,
} from 'grammy';
import {
  SEND_GIFT,
  WRONG_GIFT_TYPE,
  CHOOSE_ANOTHER_MEDIA,
} from '../../constants/captions';
import {
  CALLBACK_QUERY_TRIGGER,
  INLINE_QUERY_TRIGGER,
} from '../../constants/queries';
import type { CustomContext } from '../../context';
import { getMediaNames } from '../../utils/getFileNames';
import { getArrowsKeyboard } from '../../utils/getArrowsKeyboard';
import { sendConfirmMessage } from '../../utils/spam/sendConfirmMessage';

type ReplyWithMediaOptions = {
  ctx: CallbackQueryContext<CustomContext> | CommandContext<CustomContext>;
  mediaType: CALLBACK_QUERY_TRIGGER;
  mediaPath: string;
  notFoundMessage: string;
  inlineQueryTrigger: INLINE_QUERY_TRIGGER;
};

export async function replyWithMedia({
  ctx,
  mediaType,
  mediaPath,
  notFoundMessage,
  inlineQueryTrigger,
}: ReplyWithMediaOptions) {
  // SPAM
  await sendConfirmMessage(ctx);

  const mediaNames = await getMediaNames(mediaPath);
  if (!mediaNames.length) {
    return ctx.reply(notFoundMessage);
  }
  const inlineKeyboard = new InlineKeyboard()
    .switchInline(SEND_GIFT, inlineQueryTrigger)
    .row();
  let replyMarkup: InlineKeyboard;

  // Check if it was the /start command
  if (
    ctx.message?.text?.match(/\/start/) &&
    ctx.message?.entities &&
    ctx.message.entities[0].type === 'bot_command'
  ) {
    replyMarkup = inlineKeyboard.text(
      CHOOSE_ANOTHER_MEDIA,
      CALLBACK_QUERY_TRIGGER.NEXT,
    );
  } else {
    replyMarkup = getArrowsKeyboard(inlineKeyboard, mediaNames.length);
  }

  const inputfile = new InputFile(`${mediaPath}/${mediaNames[0]}`);
  const replyOptions = {
    reply_markup: replyMarkup,
  };

  switch (mediaType) {
    case CALLBACK_QUERY_TRIGGER.PICTURES: {
      const result = await ctx.replyWithPhoto(inputfile, replyOptions);
      ctx.session.photoFile = result.photo[0];
      break;
    }
    case CALLBACK_QUERY_TRIGGER.ANIMATIONS: {
      const result = await ctx.replyWithAnimation(inputfile, replyOptions);
      ctx.session.animationFile = result.animation;
      break;
    }
    case CALLBACK_QUERY_TRIGGER.VIDEOS: {
      const result = await ctx.replyWithVideo(inputfile, replyOptions);
      ctx.session.videoFile = result.video;
      break;
    }

    default:
      // Handle unsupported media type
      await ctx.reply(WRONG_GIFT_TYPE);
      throw new Error('Wrong gift type');
  }
}
