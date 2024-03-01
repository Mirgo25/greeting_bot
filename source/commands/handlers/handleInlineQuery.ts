import { InlineQueryResultBuilder, type InlineQueryContext } from 'grammy';
import type { InlineQueryResult, InlineQueryResultsButton } from 'grammy/types';
import { SEND_GIFT } from '../../constants/captions';
import type { CustomContext } from '../../context';
import { v4 as uuidv4 } from 'uuid';
import { INLINE_QUERY_TRIGGER } from '../../constants/queries';

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

  const { animationFile, photoFile, videoFile } = ctx.session;
  switch (mediaType) {
    case INLINE_QUERY_TRIGGER.SEND_PICTURE:
      if (photoFile)
        results.push(
          InlineQueryResultBuilder.photoCached(uuidv4(), photoFile.file_id),
        );
      break;

    case INLINE_QUERY_TRIGGER.SEND_ANIMATION:
      if (animationFile)
        results.push(
          InlineQueryResultBuilder.gifCached(uuidv4(), animationFile.file_id),
        );
      break;

    case INLINE_QUERY_TRIGGER.SEND_VIDEO:
      if (videoFile)
        results.push(
          InlineQueryResultBuilder.videoCached(
            uuidv4(),
            videoFile.file_name ?? 'Відео',
            videoFile.file_id,
          ),
        );
      break;
  }
  await ctx.answerInlineQuery(results, {
    cache_time: 0,
    button: !results.length ? button : undefined,
  });
}
