import pino from 'pino';
import type { BotConfig } from './config';

type LoggerClient = ReturnType<typeof pino>;
function getLoggerClient(): LoggerClient {
  return pino({});
}

// ---------------- //

export type BotClients = {
  logger: LoggerClient;
};

export async function getClients(config: BotConfig): Promise<BotClients> {
  const clients: BotClients = {
    logger: getLoggerClient(),
  };
  return clients;
}
