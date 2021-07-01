import { ConfigService } from '@nestjs/config';

export const appConfig = (configService: ConfigService) => ({
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Headers',
      'DNT',
      'X-CustomHeader',
      'Keep-Alive',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
    ],
  },
  session: {
    /* might exsist some difference if maxAge (session) & ttl (redis) since we are not using the redisStore for
        the store options here (due to configuring CacheModule to use redis)
      */
    secret: configService.get('app.session.secret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      // best practice is to set to true during production
      secure:
        configService.get('app.environment') === 'development' ? false : true,
      httpOnly: false,
      maxAge: 6000, // millisecond * second * minute (ToDo: put configuration to .env file)
      // maxAge: 1000 * 60 * 10, // millisecond * second * minute (ToDo: put configuration to .env file)
    },
  },
});
