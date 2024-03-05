import {
  InlineQueryResultBuilder,
  type InlineQueryContext,
  InlineKeyboard,
} from 'grammy';
import type {
  InlineQueryResult,
  InlineQueryResultsButton,
  ParseMode,
} from 'grammy/types';
import {
  HAVE_GIFT,
  SEND_GIFT,
  SEND_GIFT_RETURN,
} from '../../constants/captions';
import type { CustomContext } from '../../context';
import { v4 as uuidv4 } from 'uuid';
import { INLINE_QUERY_TRIGGER } from '../../constants/queries';
import { BOT_LINK } from '../../constants/links';

type AnswerInlineQueryOptions = {
  ctx: InlineQueryContext<CustomContext>;
  mediaType: INLINE_QUERY_TRIGGER;
};

export async function handleInlineQuery({
  ctx,
  mediaType,
}: AnswerInlineQueryOptions) {
  const results: InlineQueryResult[] = [];
  const button: InlineQueryResultsButton = {
    text: SEND_GIFT,
    start_parameter: 'start',
  };
  const options: {
    caption: string;
    parse_mode: ParseMode;
    reply_markup: InlineKeyboard;
  } = {
    caption: `<b><i>${HAVE_GIFT}</i></b>`,
    parse_mode: 'HTML',
    reply_markup: new InlineKeyboard().url(SEND_GIFT_RETURN, BOT_LINK),
  };

  const { animationFile, photoFile, videoFile } = ctx.session;
  switch (mediaType) {
    case INLINE_QUERY_TRIGGER.SEND_PICTURE:
      if (photoFile)
        results.push(
          InlineQueryResultBuilder.photoCached(
            uuidv4(),
            photoFile.file_id,
            options,
          ),
        );
      break;

    case INLINE_QUERY_TRIGGER.SEND_ANIMATION:
      if (animationFile)
        results.push(
          InlineQueryResultBuilder.gifCached(
            uuidv4(),
            animationFile.file_id,
            options,
          ),
        );
      break;

    case INLINE_QUERY_TRIGGER.SEND_VIDEO:
      if (videoFile)
        results.push(
          InlineQueryResultBuilder.videoCached(
            uuidv4(),
            videoFile.file_name ?? 'Відео',
            videoFile.file_id,
            options,
          ),
        );
      break;
  }
  await ctx.answerInlineQuery(results, {
    cache_time: 0,
    button: !results.length ? button : undefined,
  });
}
