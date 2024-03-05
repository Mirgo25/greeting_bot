import {
  type CallbackQueryContext,
  InlineKeyboard,
  InputFile,
  InputMediaBuilder,
} from 'grammy';
import type { Animation, MaybeInaccessibleMessage, Video } from 'grammy/types';
import { SEND_GIFT } from '../../constants/captions';
import {
  PICTURE_PATH,
  ANIMATION_PATH,
  VIDEO_PATH,
} from '../../constants/filePaths';
import {
  CALLBACK_QUERY_TRIGGER,
  INLINE_QUERY_TRIGGER,
} from '../../constants/queries';
import type { CustomContext, CustomSession } from '../../context';
import { getArrowsKeyboard } from '../../utils/getArrowsKeyboard';
import { getMediaNames } from '../../utils/getFileNames';

const MEDIA_PATHS = {
  photo: PICTURE_PATH,
  animation: ANIMATION_PATH,
  video: VIDEO_PATH,
};

function getMediaType(
  message: MaybeInaccessibleMessage,
): keyof typeof MEDIA_PATHS | null {
  if (message.photo) return 'photo';
  if (message.animation) return 'animation';
  if (message.video) return 'video';
  return null;
}

export async function handleArrowTrigger(
  ctx: CallbackQueryContext<CustomContext>,
  navigationButton:
    | CALLBACK_QUERY_TRIGGER.PREVIOUS
    | CALLBACK_QUERY_TRIGGER.NEXT,
) {
  const message = ctx.callbackQuery.message;
  if (!message) throw new Error('Message object not found');

  const mediaType = getMediaType(message);
  if (!mediaType) throw new Error('Wrong type of message');

  const sessionCountKey: keyof Pick<
    CustomSession,
    'animationCount' | 'photoCount' | 'videoCount'
  > = `${mediaType}Count`;
  const sessionFileKey:
    | keyof Pick<
        CustomSession,
        'animationFile' | 'photoFile' | 'videoFile'
      > = `${mediaType}File`;

  const countSize = navigationButton === CALLBACK_QUERY_TRIGGER.NEXT ? 1 : -1;
  ctx.session[sessionCountKey] += countSize;

  let count = ctx.session[sessionCountKey];
  const mediaPath = MEDIA_PATHS[mediaType];
  const mediaNames = await getMediaNames(mediaPath);
  if (!mediaNames[count]) {
    count = ctx.session[sessionCountKey] = 0;
  }

  const buildInputMedia = (inputFile: InputFile) => {
    switch (mediaType) {
      case 'photo':
        return InputMediaBuilder.photo(inputFile);
      case 'animation':
        return InputMediaBuilder.animation(inputFile);
      case 'video':
        return InputMediaBuilder.video(inputFile);
      default:
        throw new Error('Wrong media type');
    }
  };

  const inputFile = new InputFile(`${mediaPath}/${mediaNames[count]}`);
  const newMedia = buildInputMedia(inputFile);
  const inlineKeyboard = new InlineKeyboard()
    .switchInline(
      SEND_GIFT,
      INLINE_QUERY_TRIGGER[
        `SEND_${mediaType.toUpperCase()}` as keyof typeof INLINE_QUERY_TRIGGER
      ],
    )
    .row();

  const replyOptions = {
    reply_markup: getArrowsKeyboard(inlineKeyboard, mediaNames.length, count),
  };

  const result = await ctx.editMessageMedia(newMedia, replyOptions);
  if (result === true) return;
  if (!result[mediaType]) throw new Error('There is no correct media type');
  if (sessionFileKey === 'photoFile') {
    ctx.session[sessionFileKey] = result.photo![0];
  } else {
    ctx.session[sessionFileKey] = result[mediaType] as Animation | Video;
  }
}
