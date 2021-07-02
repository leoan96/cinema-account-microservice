import { Session } from 'express-session';
import { AccountProfile } from './account-profile.interface';

export interface ExpressSessionUser extends Session {
  userId?: string;
  user?: AccountProfile;
}
