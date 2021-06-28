import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { AccountService } from './account.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UpdateAccountDTO } from './dto/update-account-profile.dto';
import { AccountProfile } from './interface/account-profile.interface';

@Controller('/account')
export class AccountController {
  // 1. updateAccountDto - extract only allowed property (if not included in updateAccountDto, don't extract)
  // 2. write error handling (wrong id / wrong input / malicious input - try to change _id of mongodb)
  // 3. check if account exists before updating / deleting / creating account
  // 4. input validation

  constructor(private accountService: AccountService) {}

  @Get('testHttpContext')
  configTest(): string {
    const correlationId: string = httpContext.get('correlationId');
    return correlationId;
  }

  // get all accounts
  @Get('')
  @HttpCode(200)
  async getAllAccounts(): Promise<AccountProfile[]> {
    return await this.accountService.getAllAccounts();
  }

  //   get account by id
  @Get(':id')
  @HttpCode(200)
  async getAccountById(@Param('id') theId: number): Promise<AccountProfile> {
    return await this.accountService.getAccountById(theId);
  }

  // create account
  @Post()
  @HttpCode(201)
  async createAccount(
    @Body() createAccountDto: CreateAccountDTO,
  ): Promise<void> {
    await this.accountService.createAccount(createAccountDto);
  }

  // update account
  @Put(':id')
  @HttpCode(200)
  async updateAccount(
    @Body() updateAccountDto: UpdateAccountDTO,
    @Param('id') theId: number,
  ): Promise<AccountProfile> {
    return await this.accountService.updateAccount(updateAccountDto, theId);
  }

  // delete account
  @Delete(':id')
  @HttpCode(204)
  async deleteAccount(@Param('id') theId: number): Promise<void> {
    await this.accountService.deleteAccount(theId);
  }
}
