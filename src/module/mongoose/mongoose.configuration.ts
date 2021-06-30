export const mongooseConfiguration = () => {
  mongoose: {
    uri: process.env.MONGO_DATABASE_URI;
  }
};
