export const appConfiguration = () => ({
  app: {
    session: {
      secret: process.env.EXPRESS_SESSION_SECRET,
    },
    environment: process.env.NODE_ENV || 'development',
    port: process.env.SERVER_PORT || 3000,
  },
});
