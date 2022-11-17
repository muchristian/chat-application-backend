export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1333),
  app: {
    keys: env.array("APP_KEYS"),
  },
  jwt: env("JWT_SECRET"),
});
