const env = require('./config/env');
const connectDatabase = require('./config/database');
const app = require('./app');

async function start() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Shopping List API is running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
