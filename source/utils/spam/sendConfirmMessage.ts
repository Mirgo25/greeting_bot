import {
  CallbackQueryContext,
  CommandContext,
  InlineKeyboard,
  InlineQueryContext,
} from 'grammy';
import { CustomContext } from '../../context';
import { CONFIRM, CONFIRM_YOU_ARE_NOT_ROBOT } from '../../constants/captions';
import { APPROVE_CHANNEL_LINK } from '../../constants/links';

type ContextOption =
  | CallbackQueryContext<CustomContext>
  | InlineQueryContext<CustomContext>
  | CommandContext<CustomContext>;

export async function sendConfirmMessage(ctx: ContextOption) {
  ctx.session.userActionCount += 1;
  if (
    ctx.session.userActionCount &&
    ctx.session.userActionCount % 3 === 0 &&
    !ctx.session.spam.isConfirmed
  ) {
    const userId = ctx.from?.id;
    if (userId) {
      const result = await ctx.api.sendMessage(
        userId,
        `<b>${CONFIRM_YOU_ARE_NOT_ROBOT}</b>`,
        {
          parse_mode: 'HTML',
          reply_markup: new InlineKeyboard().url(CONFIRM, APPROVE_CHANNEL_LINK),
        },
      );
      ctx.session.spam.confirmMessageIds.push(result.message_id);
      return;
    }
    throw new Error('User not found');
  }
}
