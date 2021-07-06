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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as lodash from 'lodash';
import { AuthGuard } from '../../../guard/auth.guard';
import { Roles } from '../../../guard/role/role.decorator';
import { Role } from '../../../guard/role/role.enum';
import { RoleGuard } from '../../../guard/role/role.guard';
import { ValidationPipe } from '../../../pipe/validation.pipe';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AccountService } from '../account.service';
import { CreateAccountDTO } from '../dto/create-account.dto';
import { LoginDTO } from '../dto/login.dto';
import { UpdateAccountDTO } from '../dto/update-account-profile.dto';
import { AccountProfile } from '../interface/account-profile.interface';
import { ExpressSessionUser } from '../interface/express-session-userId.interface';

@ApiTags('accounts')
@Controller('/account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get('')
  @ApiBearerAuth('redisSessionCookie')
  @ApiOperation({
    operationId: 'getUserAccountById',
    summary: 'Get a single account by redis session id',
    description:
      'Retrieves a specific acccount, authorized to appropriate redis session only',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Not authorized to performed this operation. Must have appropriate redis session',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async getAccountById(
    @Session() session: ExpressSessionUser,
  ): Promise<AccountProfile> {
    return await this.accountService.getAccountById(session.userId);
  }

  @Get('logout')
  @ApiOperation({
    operationId: 'logout',
    summary: 'Logout account',
    description: 'Logout account by destroying redis session id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged out',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async logout(@Session() theSession: ExpressSessionUser): Promise<void> {
    await this.accountService.detroySessionFromMongo(theSession.userId);
    await this.authenticationService.logout(theSession);
  }

  @Post()
  @ApiOperation({
    operationId: 'createAccount',
    summary: 'Create a new account',
    description: 'Create a new account using validated values',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully created a new account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error. Please enter valid values',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body(new ValidationPipe()) createAccountDto: CreateAccountDTO,
  ): Promise<AccountProfile> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @Post('login')
  @ApiOperation({
    operationId: 'login',
    summary: 'Login account',
    description: 'Login account by setting redis session id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged in account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid login credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDTO,
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

  // remove ability to update password, create a new route for password change
  // perform validation and filter out undefined properties from body, error produced when using swagger ui to update
  @Put('')
  @ApiBearerAuth('redisSessionCookie')
  @ApiOperation({
    operationId: 'updateUserAccount',
    summary: 'Update account with valid redis session id',
    description: 'Update account, authorized to appropriate redis session only',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Not authorized to performed this operation. Must have appropriate redis session',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async updateAccount(
    @Body(new ValidationPipe()) updateAccountDto: UpdateAccountDTO,
    @Session() session: ExpressSessionUser,
  ): Promise<AccountProfile> {
    return await this.accountService.updateAccount(
      updateAccountDto,
      session.userId,
    );
  }

  @Delete('')
  @ApiBearerAuth('redisSessionCookie')
  @ApiOperation({
    operationId: 'deleteUserAccount',
    summary: 'Delete account with valid redis session id',
    description: 'Delete account, authorized to appropriate redis session only',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Not authorized to performed this operation. Must have appropriate redis session',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteAccount(@Session() session: ExpressSessionUser): Promise<void> {
    await this.accountService.deleteAccount(session.userId);
  }
}
