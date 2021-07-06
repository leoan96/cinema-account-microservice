import {
  getAllAccountsReponse,
  getAccountByRedisSessionIdReponse,
  getAccountByIdReponse,
  createAccountReponse,
  updateAccountReponse,
  deleteAccountReponse,
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
};
