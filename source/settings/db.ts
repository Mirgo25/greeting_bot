import 'dotenv/config';
import mongoose from 'mongoose';

function getMongoDbUrl() {
  return (
    'mongodb+srv://' +
    (process.env.MONGO_LOGIN ?? '') +
    ':' +
    (process.env.MONGO_PASSWORD ?? '') +
    '@' +
    (process.env.MONGO_HOST ?? '') +
    '/' +
    (process.env.MONGO_DB ?? '')
  );
}

export async function connectDb() {
  try {
    const dbUrl = getMongoDbUrl();
    const mongoDbConnection = await mongoose.connect(dbUrl, {
      retryReads: true,
      retryWrites: true,
      writeConcern: {
        w: 'majority',
      },
    });
    if (mongoDbConnection.connection.readyState === 1) {
      console.info(`[connectDb][DB connected succesfully]`, {
        metadata: '',
        sendLog: true,
      });
    } else {
      console.error(`[connectDb][DB connection failed]`, { metadata: '' });
    }
  } catch (error: any) {
    console.error(`[connectDb][DB connection failed]`, {
      metadata: { error: error, stack: error.stack.toString() },
    });
  }
}
