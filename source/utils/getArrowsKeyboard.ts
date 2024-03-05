import type { InlineKeyboard } from 'grammy';
import { NEXT, PREVIOUS } from '../constants/captions';
import { CALLBACK_QUERY_TRIGGER } from '../constants/queries';

export function getArrowsKeyboard(
  inlineKeyboard: InlineKeyboard,
  mediaLength: number,
  mediaCount = 0,
): InlineKeyboard {
  if (mediaLength === 1) {
    return inlineKeyboard;
  }
  switch (mediaCount) {
    case 0:
      return inlineKeyboard.text(NEXT, CALLBACK_QUERY_TRIGGER.NEXT);

    case mediaLength - 1:
      return inlineKeyboard.text(PREVIOUS, CALLBACK_QUERY_TRIGGER.PREVIOUS);

    default:
      return inlineKeyboard
        .text(PREVIOUS, CALLBACK_QUERY_TRIGGER.PREVIOUS)
        .text(NEXT, CALLBACK_QUERY_TRIGGER.NEXT);
  }
}
