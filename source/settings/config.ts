import 'dotenv/config';

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
