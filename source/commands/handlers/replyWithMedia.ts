import { type CallbackQueryContext, InlineKeyboard, InputFile } from 'grammy';
import {
  SEND_GIFT,
  PREVIOUS,
  NEXT,
  WRONG_GIFT_TYPE,
} from '../../constants/captions';
import {
  CALLBACK_QUERY_TRIGGER,
  INLINE_QUERY_TRIGGER,
} from '../../constants/queries';
import type { CustomContext } from '../../context';
import { getMediaNames } from '../../utils/getFileNames';

type ReplyWithMediaOptions = {
  ctx: CallbackQueryContext<CustomContext>;
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
  const mediaNames = await getMediaNames(mediaPath);
  if (!mediaNames.length) {
    return ctx.reply(notFoundMessage);
  }
  const inlineKeyboard = new InlineKeyboard()
    .switchInline(SEND_GIFT, inlineQueryTrigger)
    .row()
    .text(PREVIOUS, CALLBACK_QUERY_TRIGGER.PREVIOUS)
    .text(NEXT, CALLBACK_QUERY_TRIGGER.NEXT);

  const inputfile = new InputFile(`${mediaPath}/${mediaNames[0]}`);
  const replyOptions = {
    reply_markup: inlineKeyboard,
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
      const result = await ctx.replyWithVideo(inputfile, {
        reply_markup: inlineKeyboard,
      });
      ctx.session.videoFile = result.video;
      break;
    }

    default:
      // Handle unsupported media type
      await ctx.reply(WRONG_GIFT_TYPE);
      throw new Error('Wrong gift type');
  }
}
