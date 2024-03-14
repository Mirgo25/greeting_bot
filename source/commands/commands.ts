import { Composer, InlineKeyboard, InputMediaBuilder } from 'grammy';
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
  NEXT,
  PICTURES,
  PICTURES_NOT_FOUND,
  PREVIOUS,
  SEND_GIFT,
  VIDEOS,
  VIDEOS_NOT_FOUND,
} from '../constants/captions';
import {
  CALLBACK_QUERY_TRIGGER,
  INLINE_QUERY_TRIGGER,
} from '../constants/queries';
import { replyWithMedia } from './handlers/replyWithMedia';
import { handleInlineQuery } from './handlers/handleInlineQuery';
import { getMediaNames } from '../utils/getFileNames';
import {
  Animation,
  Chat,
  InputFile,
  InputMedia,
  InputMediaPhoto,
  PhotoSize,
  Video,
} from 'grammy/types';
import { getArrowsKeyboard } from '../utils/getArrowsKeyboard';
import { handleArrowTrigger } from './handlers/handleArrowTrigger';
import { addUser } from '../db/operations/users';

const commands = new Composer<CustomContext>();

// ------- COMMANDS -------
commands.command(
  'start',
  async (ctx) => {
    const {
      id: chatId,
      username: userName,
      first_name: firstName,
      last_name: lastName,
    } = ctx.chat as Chat.PrivateChat;
    await addUser({
      chatId,
      userName,
      firstName,
      lastName,
      userId: ctx.from?.id,
    });
    await replyWithMedia({
      ctx,
      mediaType: CALLBACK_QUERY_TRIGGER.ANIMATIONS,
      mediaPath: ANIMATION_PATH,
      notFoundMessage: ANIMATIONS_NOT_FOUND,
      inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_ANIMATION,
    });
  },

  // {
  //   const inlineKeyboard = new InlineKeyboard()
  //     .text(PICTURES, CALLBACK_QUERY_TRIGGER.PICTURES)
  //     .text(ANIMATIONS, CALLBACK_QUERY_TRIGGER.ANIMATIONS)
  //     .text(VIDEOS, CALLBACK_QUERY_TRIGGER.VIDEOS);

  //   await ctx.reply(CHOOSE_GIFT_TYPE, {
  //     reply_markup: inlineKeyboard,
  //   });
  // },
);

// ------- CALLBACK QUERIES -------
// XXX: Unused
// commands.callbackQuery(CALLBACK_QUERY_TRIGGER.PICTURES, async (ctx) => {
//   await replyWithMedia({
//     ctx,
//     mediaType: CALLBACK_QUERY_TRIGGER.PICTURES,
//     mediaPath: PICTURE_PATH,
//     notFoundMessage: PICTURES_NOT_FOUND,
//     inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_PICTURE,
//   });
// });

// commands.callbackQuery(CALLBACK_QUERY_TRIGGER.ANIMATIONS, async (ctx) =>
//   replyWithMedia({
//     ctx,
//     mediaType: CALLBACK_QUERY_TRIGGER.ANIMATIONS,
//     mediaPath: ANIMATION_PATH,
//     notFoundMessage: ANIMATIONS_NOT_FOUND,
//     inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_ANIMATION,
//   }),
// );

// XXX: Unused
// commands.callbackQuery(CALLBACK_QUERY_TRIGGER.VIDEOS, async (ctx) =>
//   replyWithMedia({
//     ctx,
//     mediaType: CALLBACK_QUERY_TRIGGER.VIDEOS,
//     mediaPath: VIDEO_PATH,
//     notFoundMessage: VIDEOS_NOT_FOUND,
//     inlineQueryTrigger: INLINE_QUERY_TRIGGER.SEND_VIDEO,
//   }),
// );

commands.callbackQuery(CALLBACK_QUERY_TRIGGER.NEXT, async (ctx) =>
  handleArrowTrigger(ctx, CALLBACK_QUERY_TRIGGER.NEXT),
);

commands.callbackQuery(CALLBACK_QUERY_TRIGGER.PREVIOUS, async (ctx) =>
  handleArrowTrigger(ctx, CALLBACK_QUERY_TRIGGER.PREVIOUS),
);

// ------- INLINE QUERIES -------
// XXX: Unused
// commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_PICTURE, async (ctx) =>
//   handleInlineQuery({
//     ctx,
//     mediaType: INLINE_QUERY_TRIGGER.SEND_PICTURE,
//   }),
// );

commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_ANIMATION, async (ctx) =>
  handleInlineQuery({
    ctx,
    mediaType: INLINE_QUERY_TRIGGER.SEND_ANIMATION,
  }),
);

// XXX: Unused
// commands.inlineQuery(INLINE_QUERY_TRIGGER.SEND_VIDEO, async (ctx) =>
//   handleInlineQuery({
//     ctx,
//     mediaType: INLINE_QUERY_TRIGGER.SEND_VIDEO,
//   }),
// );

// ------- FILTER QUERIES -------
commands.on('chat_join_request', async (ctx) => {
  ctx.session.spam.isConfirmed = true;
  const { user_chat_id } = ctx.chatJoinRequest;
  await ctx.api.deleteMessages(
    user_chat_id,
    ctx.session.spam.confirmMessageIds,
  );
});

export default commands;
