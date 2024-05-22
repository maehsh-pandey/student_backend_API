const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod" && process.env.NODE_ENV !== undefined) {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  SESSION_SECRET : process.env.SESSION_SECRET
};
