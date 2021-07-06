import { Cookie } from 'express-session';
import { UpdateAccountDTO } from '../dto/update-account-profile.dto';
import { AccountProfile } from '../interface/account-profile.interface';
import { ExpressSessionUser } from '../interface/express-session-userId.interface';
import {
  getAllAccountsReponse,
  getAccountByRedisSessionIdReponse,
  getAccountByIdReponse,
  createAccountReponse,
  updateAccountReponse,
  deleteAccountReponse,
  destroySessionReponse,
} from './account-admin.mock-response';

export const mockAccountService = {
  getAllAccounts: jest.fn().mockResolvedValue(getAllAccountsReponse),
  getAccountByRedisSessionId: jest
    .fn()
    .mockResolvedValue(getAccountByRedisSessionIdReponse),
  getAccountById: jest.fn().mockResolvedValue(getAccountByIdReponse),
  createAccount: jest.fn().mockResolvedValue(createAccountReponse),
  updateAccount: jest.fn().mockResolvedValue(updateAccountReponse),
  deleteAccount: jest.fn().mockResolvedValue(deleteAccountReponse),
  destroySession: jest.fn().mockResolvedValue(destroySessionReponse),
};

export const mockCookie: Cookie = {
  originalMaxAge: 1000,
};

export const mockUser: AccountProfile = {
  firstName: 'Kay',
  lastName: 'Johnathan',
  email: 'kay@gmail.com',
  gender: 'male',
  phone: '930-129-293',
  language: 'en',
  createdAt: new Date('2021-07-06T07:36:34.394Z'),
  updatedAt: new Date('2021-07-06T07:36:34.394Z'),
  avatar: 'https://image.flaticon.com/icons/png/512/2922/2922688.png',
  role: ['user'],
};

export const mockUpdateUser: UpdateAccountDTO = {
  firstName: 'Kay',
  lastName: 'Johnathan',
  email: 'kay@gmail.com',
  gender: 'male',
  phone: '930-129-293',
  language: 'en',
  createdAt: new Date('2021-07-06T07:36:34.394Z'),
  updatedAt: new Date('2021-07-06T07:36:34.394Z'),
  avatar: 'https://image.flaticon.com/icons/png/512/2922/2922688.png',
};

export const mockSession: ExpressSessionUser = {
  id: '1',
  cookie: mockCookie,
  regenerate: jest.fn(),
  destroy: jest.fn(),
  reload: jest.fn(),
  resetMaxAge: jest.fn(),
  save: jest.fn(),
  touch: jest.fn(),
  user: mockUser,
};
