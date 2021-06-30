import { Session } from 'express-session';

export interface ExpressSessionUserId extends Session {
  userId: string;
}
