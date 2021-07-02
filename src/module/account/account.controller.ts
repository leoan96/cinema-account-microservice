import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Session,
} from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { AuthenticationService } from '../authentication/authentication.service';
import { AccountService } from './account.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { LoginDTO } from './dto/login.dto';
import { UpdateAccountDTO } from './dto/update-account-profile.dto';
import { AccountProfile } from './interface/account-profile.interface';
import { ExpressSessionUserId } from './interface/express-session-userId.interface';

@Controller('/account')
export class AccountController {
  //   1. updateAccountDto - extract only allowed property (if not included in updateAccountDto, don't extract)
  //   2. write error handling (wrong id / wrong input / malicious input - try to change _id of mongodb)
  //   3. check if account exists before updating / deleting / creating account
  //   4. add feature support to store an array of session id to schema

  constructor(
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
  ) {}

  // testing express-http-context library
  // REMOVE: when logger middleware is implemented
  @Get('testHttpContext')
  configTest(): string {
    const correlationId: string = httpContext.get('correlationId');
    return correlationId;
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Session() theSession: ExpressSessionUserId): Promise<void> {
    await this.accountService.detroySessionFromMongo(theSession.userId);
    await this.authenticationService.logout(theSession);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllAccounts(): Promise<AccountProfile[]> {
    return await this.accountService.getAllAccounts();
  }

  @Get('destroySession/:id')
  @HttpCode(HttpStatus.OK)
  async destroySession(@Param('id') sessionid: string): Promise<void> {
    await this.accountService.destroySession(sessionid);
  }

  // this @Get(:id) route handler should be put as the last of @Get() as it has param as path
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAccountById(@Param('id') theId: number): Promise<AccountProfile> {
    return await this.accountService.getAccountById(theId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body() createAccountDto: CreateAccountDTO,
  ): Promise<void> {
    await this.accountService.createAccount(createAccountDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDTO,
    @Session() theSession: ExpressSessionUserId,
  ): Promise<AccountProfile> {
    const { email, password } = loginDto;

    // create error handler for case when authenticationService throws error
    const account: AccountProfile = await this.authenticationService.login({
      email,
      password,
    });

    theSession.userId = account['_id'];
    await this.accountService.saveSessionToMongo(
      theSession.userId,
      theSession.id,
    );
    return account;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAccount(
    @Body() updateAccountDto: UpdateAccountDTO,
    @Param('id') theId: number,
  ): Promise<AccountProfile> {
    return await this.accountService.updateAccount(updateAccountDto, theId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Param('id') theId: number): Promise<void> {
    await this.accountService.deleteAccount(theId);
  }
}
