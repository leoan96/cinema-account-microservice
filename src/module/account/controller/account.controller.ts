import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import * as httpContext from 'express-http-context';
import * as lodash from 'lodash';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/role/role.decorator';
import { Role } from 'src/guard/role/role.enum';
import { RoleGuard } from 'src/guard/role/role.guard';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AccountService } from '../account.service';
import { CreateAccountDTO } from '../dto/create-account.dto';
import { LoginDTO } from '../dto/login.dto';
import { UpdateAccountDTO } from '../dto/update-account-profile.dto';
import { AccountProfile } from '../interface/account-profile.interface';
import { ExpressSessionUser } from '../interface/express-session-userId.interface';

@Controller('/account')
export class AccountController {
  //   1. updateAccountDto - extract only allowed property (if not included in updateAccountDto, don't extract)
  //   2. write error handling (wrong id / wrong input / malicious input - try to change _id of mongodb)
  //   3. check if account exists before updating / deleting / creating account
  //   4. add feature support to store an array of session id to schema

  private readonly logger = new Logger(AccountController.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async getAccountById(
    @Session() session: ExpressSessionUser,
  ): Promise<AccountProfile> {
    return await this.accountService.getAccountById(session.userId);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async logout(@Session() theSession: ExpressSessionUser): Promise<void> {
    await this.accountService.detroySessionFromMongo(theSession.userId);
    await this.authenticationService.logout(theSession);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body(new ValidationPipe()) createAccountDto: CreateAccountDTO,
  ): Promise<AccountProfile> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDTO,
    @Session() theSession: ExpressSessionUser,
  ): Promise<AccountProfile> {
    const { email, password } = loginDto;

    // create error handler for case when authenticationService throws error
    const account: AccountProfile = await this.authenticationService.login({
      email,
      password,
    });

    /*
        Found a problem:
        1. if a legitimate user login successfully, a session associated with the user 
           would be saved to redis with a ttl.
        2. but if the user deletes his session and login again, we would issue a new session
           to the user as the user does not have the previously deleted sessions.
        3. now we have 2 session associated with the user (but 1 is unused & won't be used again, the other 
           1 would be used)
        4. if the user repeatedly performs step (2), this would cause excessive redis session to be created while
           only one session is actually being used.
    */
    theSession.userId = account['_id'];
    theSession.user = account;

    await this.accountService.saveSessionToMongo(
      theSession.userId,
      theSession.id,
    );
    return lodash.omit(account, ['role']);
  }

  @Put('')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async updateAccount(
    @Body() updateAccountDto: UpdateAccountDTO,
    @Session() session: ExpressSessionUser,
  ): Promise<AccountProfile> {
    return await this.accountService.updateAccount(
      updateAccountDto,
      session.userId,
    );
  }

  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteAccount(@Session() session: ExpressSessionUser): Promise<void> {
    await this.accountService.deleteAccount(session.userId);
  }
}
