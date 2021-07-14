export const API_ACCOUNT_KAFKA = {
  SERVICE_NAME: 'DESTROY_REDIS_SESSION_SERVICE',
  DESTROY_REDIS_SESSION_TOPIC: 'destroy_redis_session_from_mongodb',
  CLIENT_ID: 'api-account-producer',
  BROKERS: ['localhost:9092'],
  CONSUMER_GROUP_ID: 'destroy_session',
};
