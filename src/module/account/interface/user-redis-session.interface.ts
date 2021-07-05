export interface UserRedisSession {
  id?: string;
  redisSessionId?: string;
  role: [string];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
}
