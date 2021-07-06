import { AccountProfile } from '../interface/account-profile.interface';
import { mockUpdateUser, mockUser } from './account-admin.mock';

export const getAllAccountsReponse: AccountProfile[] = [mockUser];

export const getAccountByRedisSessionIdReponse: AccountProfile = mockUser;

export const getAccountByIdReponse: AccountProfile = mockUser;

export const createAccountReponse = {};

export const updateAccountReponse = mockUpdateUser;

export const deleteAccountReponse = {};

export const destroySessionReponse = undefined;
