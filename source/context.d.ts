import type { Context, SessionFlavor } from 'grammy';
import type { PhotoSize, Animation, Video } from 'grammy/types';
import type { BotClients } from './settings/clients';
import type { Nullable } from './types/nullable';

export type CustomSession = {
  photoFile: Nullable<PhotoSize>;
  animationFile: Nullable<Animation>;
  videoFile: Nullable<Video>;
  photoCount: number;
  animationCount: number;
  videoCount: number;
  userActionCount: number;
};

export type CustomContext = Context &
  SessionFlavor<CustomSession> & {
    log: BotClients['logger'];
    config: {
      errorChatId: string;
      adminChatId: string;
    };
  };
