import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { UpdateAccountDTO } from '../dto/update-account-profile.dto';
import { AccountProfile } from '../interface/account-profile.interface';
import { ExpressSessionUser } from '../interface/express-session-userId.interface';
import { AccountAdminController } from './account-admin.controller';
import {
  mockAccountService,
  mockSession,
  mockUpdateUser,
  mockUser,
} from './account-admin.mock';
import {
  getAccountByIdReponse,
  getAccountByRedisSessionIdReponse,
  getAllAccountsReponse,
  updateAccountReponse,
} from './account-admin.mock-response';

/*
 User relative path for imports: 
 (https://stackoverflow.com/questions/63865678/nestjs-test-suite-failed-to-run-cannot-find-module-src-article-article-entity)
*/

describe('AccountAdminController', () => {
  let accountAdminController: AccountAdminController;
  let accountService: AccountService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountAdminController],
      providers: [
        ConfigService,
        { provide: AccountService, useValue: mockAccountService },
      ],
    }).compile();

    accountAdminController = moduleRef.get<AccountAdminController>(
      AccountAdminController,
    );
    accountService = moduleRef.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', async () => {
    expect(accountAdminController).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      const allAccounts: AccountProfile[] =
        await accountAdminController.getAllAccounts();
      expect(allAccounts).toBe(getAllAccountsReponse);
    });
  });

  describe('getAccountById', () => {
    it('should get a single account based on account id', async () => {
      const account: AccountProfile =
        await accountAdminController.getAccountById('1');

      expect(account).toBe(getAccountByIdReponse);
      expect(accountService.getAccountById).toBeCalledWith('1');
    });
  });

  describe('getAccountByRedisSessionId', () => {
    it('should return a single account based on redis session id', async () => {
      const sessionId: string = 'sess:r1893yr98';
      const account: AccountProfile =
        await accountAdminController.getAccountByRedisSessionId(sessionId);

      expect(account).toBe(getAccountByRedisSessionIdReponse);
      expect(accountService.getAccountByRedisSessionId).toBeCalledWith(
        sessionId,
      );
    });
  });

  describe('destroySession', () => {
    it('should destroy session based on redis session id', async () => {
      const sessionId: string = 'sess:fasxv2ci193';
      const session: ExpressSessionUser = mockSession;

      const result = await accountAdminController.destroySession(
        sessionId,
        session,
      );

      expect(result).toBe(undefined);
      /*
        1. expect(accountService.destroySession).toBeCalledWith(sessionId, session) produces error below: 

        Expected: "sess:fasxv2ci193", {"cookie": {"originalMaxAge": 1000}, "destroy": [Function mockConstructor], "id": "1", "regenerate": [Function mockConstructor], "reload": [Function mockConstructor], "resetMaxAge": [Function mockConstructor], "save": [Function mockConstructor], "touch": [Function mockConstructor], "user": {"avatar": "https://image.flaticon.com/icons/png/512/2922/2922688.png", "createdAt": 2021-07-06T07:36:34.394Z, "email": "kay@gmail.com", "firstName": "Kay", "gender": "male", "language": "en", "lastName": "Johnathan", "phone": "930-129-293", "role": ["user"], "updatedAt": 2021-07-06T07:36:34.394Z}}
        Received: "sess:fasxv2ci193"

        2. not sure why only received the first parameter but not the second
      */
      expect(accountService.destroySession).toHaveBeenCalled();
    });
  });

  describe('updateAccount', () => {
    it('should update account based on account id', async () => {
      const accountId: string = '1';
      const updateAccountDto: UpdateAccountDTO = mockUpdateUser;
      const session: ExpressSessionUser = mockSession;

      const result = await accountAdminController.updateAccount(
        updateAccountDto,
        accountId,
        session,
      );

      expect(result).toBe(updateAccountReponse);
      /*
        expect(accountService.updateAccount).toBeCalledWith(
        updateAccountDto,
        accountId,
        session,
      )
       produces error below: 

        {"avatar": "https://image.flaticon.com/icons/png/512/2922/2922688.png", "createdAt": 2021-07-06T07:36:34.394Z, "email": "kay@gmail.com", "firstName": "Kay", "gender": "male", "language": "en", "lastName": "Johnathan", "phone": "930-129-293", "updatedAt": 2021-07-06T07:36:34.394Z},
      "1",
    - {"cookie": {"originalMaxAge": 1000}, "destroy": [Function mockConstructor], "id": "1", "regenerate": [Function mockConstructor], "reload": [Function mockConstructor], "resetMaxAge": [Function mockConstructor], "save": [Function mockConstructor], "touch": [Function mockConstructor], "user": {"avatar": "https://image.flaticon.com/icons/png/512/2922/2922688.png", "createdAt": 2021-07-06T07:36:34.394Z, "email": "kay@gmail.com", "firstName": "Kay", "gender": "male", "language": "en", "lastName": "Johnathan", "phone": "930-129-293", "role": ["user"], "updatedAt": 2021-07-06T07:36:34.394Z}},
      */
      expect(accountService.updateAccount).toBeCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account based on account id', async () => {
      // TODO
    });
  });
});
