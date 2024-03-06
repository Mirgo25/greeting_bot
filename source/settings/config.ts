import 'dotenv/config';
import { CustomSession } from '../context';

type TelegramConfig = {
  botToken: string;
  adminChatId: string;
  errorChatId: string;
};

function getTelegramConfig(): TelegramConfig {
  const config: TelegramConfig = {
    botToken: process.env.BOT_TOKEN ?? '',
    adminChatId: process.env.ADMIN_CHAT_ID ?? '',
    errorChatId: process.env.ERROR_CHAT_ID ?? '',
  };

  if (!config.botToken) throw new Error('Empty TG Bot token');
  return config;
}

// --------------------------- //

export type BotConfig = {
  telegram: TelegramConfig;
};

export function getConfig(): BotConfig {
  return {
    telegram: getTelegramConfig(),
  };
}

// --------------------------- //

export function getInitialSessionData(): CustomSession {
  return {
    animationFile: null,
    photoFile: null,
    videoFile: null,
    photoCount: 0,
    animationCount: 0,
    videoCount: 0,
    userActionCount: 0,
    spam: {
      confirmMessageIds: [],
      isConfirmed: false
    },
  };
}
