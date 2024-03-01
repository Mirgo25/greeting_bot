import { Composer, InlineKeyboard } from 'grammy';
import type { CustomContext } from '../context';
import {
  ANIMATION_PATH,
  PICTURE_PATH,
  VIDEO_PATH,
} from '../constants/filePaths';
import {
  ANIMATIONS,
  ANIMATIONS_NOT_FOUND,
  CHOOSE_GIFT_TYPE,
  PICTURES,
  PICTURES_NOT_FOUND,
  VIDEOS,
  VIDEOS_NOT_FOUND,
} from '../constants/captions';
import {
  CALLBACK_QUERY_TRIGGER,
  INLINE_QUERY_TRIGGER,
} from '../constants/queries';
import { replyWithMedia } from './handlers/replyWithMedia';
import { handleInlineQuery } from './handlers/handleInlineQuery';

const commands = new Composer<CustomContext>();

commands.command('start', async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text(PICTURES, CALLBACK_QUERY_TRIGGER.PICTURES)
    .text(ANIMATIONS, CALLBACK_QUERY_TRIGGER.ANIMATIONS)
    .text(VIDEOS, CALLBACK_QUERY_TRIGGER.VIDEOS);

  await ctx.reply(CHOOSE_GIFT_TYPE, {
    reply_markup: inlineKeyboard,
  });
});

commands.callbackQuery(CALLBACK_QUERY_TRIGGER.PICTURES, async (ctx) =>
  replyWithMedia({
    ctx,
    mediaType: CALLBACK_QUERY_TRIGGER.PICTURES,
    mediaPath: PICTURE_PATH,
    notFoundMessage: PICTURES_NOT_FOUND,
    inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_PICTURE,
  }),
);

commands.callbackQuery(CALLBACK_QUERY_TRIGGER.ANIMATIONS, async (ctx) =>
  replyWithMedia({
    ctx,
    mediaType: CALLBACK_QUERY_TRIGGER.ANIMATIONS,
    mediaPath: ANIMATION_PATH,
    notFoundMessage: ANIMATIONS_NOT_FOUND,
    inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_ANIMATION,
  }),
);

commands.callbackQuery(CALLBACK_QUERY_TRIGGER.VIDEOS, async (ctx) =>
  replyWithMedia({
    ctx,
    mediaType: CALLBACK_QUERY_TRIGGER.VIDEOS,
    mediaPath: VIDEO_PATH,
    notFoundMessage: VIDEOS_NOT_FOUND,
    inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_VIDEO,
  }),
);

// commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_PICTURE, async (ctx) => {
//   const results: InlineQueryResult[] = [];
//   let button: InlineQueryResultsButton | undefined = undefined;

//   const { file } = ctx.session as { file: Nullable<PhotoSize> };
//   if (!file) {
//     button = {
//       text: SEND_GIFT,
//       start_parameter: 'start',
//     };
//   } else {
//     results.push(InlineQueryResultBuilder.photoCached(uuidv4(), file.file_id));
//   }

//   await ctx.answerInlineQuery(results, { cache_time: 0, button });
// });

commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_PICTURE, async (ctx) =>
  handleInlineQuery({
    ctx,
    mediaType: INLINE_QUERY_TRIGGER.SEND_PICTURE,
  }),
);

// commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_ANIMATION, async (ctx) => {
//   const results: InlineQueryResult[] = [];
//   let button: InlineQueryResultsButton | undefined = undefined;

//   const { file } = ctx.session as { file: Nullable<Animation> };
//   if (!file) {
//     button = {
//       text: SEND_GIFT,
//       start_parameter: 'start',
//     };
//   } else {
//     results.push(InlineQueryResultBuilder.gifCached(uuidv4(), file.file_id));
//   }

//   await ctx.answerInlineQuery(results, { cache_time: 0, button });
// });

commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_ANIMATION, async (ctx) =>
  handleInlineQuery({
    ctx,
    mediaType: INLINE_QUERY_TRIGGER.SEND_ANIMATION,
  }),
);

// commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_VIDEO, async (ctx) => {
//   const results: InlineQueryResult[] = [];
//   let button: InlineQueryResultsButton | undefined = undefined;

//   const { file } = ctx.session as { file: Nullable<Video> };
//   if (!file) {
//     button = {
//       text: SEND_GIFT,
//       start_parameter: 'start',
//     };
//   } else {
//     results.push(
//       InlineQueryResultBuilder.videoCached(
//         uuidv4(),
//         file.file_name ?? 'Гарне відео',
//         file.file_id,
//       ),
//     );
//   }

//   await ctx.answerInlineQuery(results, { cache_time: 0, button });
// });

commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_VIDEO, async (ctx) =>
  handleInlineQuery({
    ctx,
    mediaType: INLINE_QUERY_TRIGGER.SEND_VIDEO,
  }),
);

export default commands;
