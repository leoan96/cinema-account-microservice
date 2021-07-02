import { Session } from 'express-session';

export interface ExpressSessionUser extends Session {
  userId: string;
  role: [string];
}
