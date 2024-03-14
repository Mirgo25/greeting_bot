import { UserDoc, User } from '../schemas/user';

export const addUser = async ({
  chatId,
  userId,
  userName,
  firstName,
  lastName,
}: Pick<
  UserDoc,
  'chatId' | 'userId' | 'userName' | 'firstName' | 'lastName'
>) => {
  const user = await getUserByChatId(chatId);
  if (user) return null;

  const newUser = new User({
    chatId,
    userId,
    userName,
    firstName,
    lastName,
  });

  return newUser.save();
};

export const getUserByChatId = async (
  chatId: number,
): Promise<UserDoc | null> => {
  try {
    const user = await User.findOne({ chatId });
    return user;
  } catch (error: any) {
    console.error('[getUserByChatId][error]', {
      metadata: { error: error, stack: error.stack.toString() },
    });
    return null;
  }
};
