import { Bot, type Context, session } from 'grammy';
import { getConfig, getInitialSessionData } from './settings/config';
import type { CustomContext } from './context';
import commands from './commands/commands';
import { errorHandler, preMiddlewares } from './middlewares';
import { getClients } from './settings/clients';
import { MongoDBAdapter, ISession } from '@grammyjs/storage-mongodb';
import mongoose from 'mongoose';
import { connectDb } from './settings/db';

async function main() {
  // global app config
  const config = getConfig();

  // 3rd party clients, that should be inited
  const clients = await getClients(config);

  // Connect DB
  await connectDb();

  const bot = new Bot<CustomContext>(config.telegram.botToken);

  // Stores data per user.
  function getSessionKey(ctx: Context): string | undefined {
    // Give every user their personal session storage
    // (will be shared across groups and in their private chat)
    return ctx.from?.id.toString();
  }

  const collection = mongoose.connection.db.collection<ISession>('sessions');

  bot.use(
    session({
      initial: getInitialSessionData,
      getSessionKey,
      storage: new MongoDBAdapter({ collection }),
    }),
  );

  // apply pre-scenes middlewares
  bot.use(...preMiddlewares(clients, config.telegram));

  // apply handlers
  bot.use(commands);

  // error handler
  bot.catch(errorHandler);

  // set menu
  await bot.api.setMyCommands([{ command: 'start', description: 'Start bot' }]);

  // run bot
  bot.start();
  clients.logger.info('Bot is ready!');
}

main();
