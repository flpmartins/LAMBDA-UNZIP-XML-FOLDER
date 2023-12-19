module.exports = {
  secret: process.env.SECRET,
  region: process.env.REGION,
  postgres: {
    database: process.env.POSTGRES_DATABASE,
    secretManager: process.env.POSTGRES_SECRET_MANAGER,
    pool: {
      min: Number(process.env.POSTGRES_MIN_POOL),
      max: Number(process.env.POSTGRES_MAX_POOL),
      idle: Number(process.env.POSTGRES_IDLE_TIME),
    },
    logging: false,
    timezone: process.env.POSTGRES_TIMEZONE,
  },
};
