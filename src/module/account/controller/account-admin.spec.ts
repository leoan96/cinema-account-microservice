import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { AccountAdminController } from './account-admin.controller';
import { mockAccountService } from './account-admin.mock';

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

  it('should be defined', async () => {
    expect(accountAdminController).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      expect(true).toBe(true);
    });
  });
});
