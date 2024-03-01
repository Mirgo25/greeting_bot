import type { BotError, NextFunction } from 'grammy';
import type { CustomContext } from './context';
import { BotClients } from './settings/clients';

function extendContext(
  clients: BotClients,
  config: { errorChatId: string; adminChatId: string },
) {
  return (ctx: CustomContext, next: NextFunction) => {
    ctx.log = clients.logger;
    ctx.config = config;

    return next();
  };
}

function logUpdates(ctx: CustomContext, next: NextFunction) {
  ctx.log.info({ ...ctx.update });
  return next();
}

export function preMiddlewares(
  clients: BotClients,
  config: { errorChatId: string; adminChatId: string },
) {
  return [extendContext(clients, config), logUpdates];
}

export async function errorHandler(err: BotError<CustomContext>) {
  let { ctx, message, stack } = err;

  if (!stack) stack = 'Stack is empty';
  ctx.log.error(`Update ${ctx.update.update_id} error \n` + stack);
  ctx.log.error({ ...ctx.update });

  // return ctx.api.sendMessage(
  //   ctx.config.errorChatId,
  //   `❌ Error: \n${message} \n\n` +
  //     `🔄 Update: \n${JSON.stringify(ctx.update)}`,
  // );
}
