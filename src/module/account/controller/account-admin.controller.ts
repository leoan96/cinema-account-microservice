import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../../guard/auth.guard';
import { Roles } from '../../../guard/role/role.decorator';
import { Role } from '../../../guard/role/role.enum';
import { RoleGuard } from '../../../guard/role/role.guard';
import { UpdateAccountDTO } from '../dto/update-account-profile.dto';
import { AccountProfile } from '../interface/account-profile.interface';
import { AccountService } from '../account.service';
import { ExpressSessionUser } from '../interface/express-session-userId.interface';
import { ValidationPipe } from '../../../pipe/validation.pipe';
import { UserRedisSession } from '../interface/user-redis-session.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('admin')
@Controller('/account/admin')
export class AccountAdminController {
  private readonly logger = new Logger(AccountAdminController.name);

  constructor(private readonly accountService: AccountService) {}

  @Get('')
  @ApiBearerAuth('backendToken')
  @ApiOperation({
    operationId: 'getAllAccounts',
    summary: 'Get all accounts',
    description:
      'Retrieves all acccount, authorized to admin role or backend token only',
  })
  @ApiOkResponse({
    description: 'Retrieved all accounts',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must have admin role or backend token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllAccounts(): Promise<AccountProfile[]> {
    return await this.accountService.getAllAccounts();
  }

  @Get(':id')
  @ApiBearerAuth('backendToken')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Account id',
    required: true,
  })
  @ApiOperation({
    operationId: 'getAccountById',
    summary: 'Get a single account by account id',
    description:
      'Retrieves a specific acccount, authorized to admin role or backend token only',
  })
  @ApiOkResponse({
    description: 'Retrieved account',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must have admin role or backend token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async getAccountById(
    @Param('id') accountId: string,
  ): Promise<AccountProfile> {
    return await this.accountService.getAccountById(accountId);
  }

  @ApiBearerAuth('backendToken')
  @ApiParam({
    name: 'redisSessionId',
    type: String,
    description: 'Redis session id',
    required: true,
  })
  @ApiOperation({
    operationId: 'getAccountByRedisSessionId',
    summary: 'Get a single account by redis session id',
    description:
      'Retrieves a specific acccount, authorized to admin role or backend token only',
  })
  @ApiOkResponse({
    description: 'Retrieved account',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must have admin role or backend token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @Get('getAccountByRedisSessionId/:redisSessionId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async getAccountByRedisSessionId(
    @Param('redisSessionId') sessionId,
  ): Promise<UserRedisSession> {
    return await this.accountService.getAccountByRedisSessionId(sessionId);
  }

  @Get('destroySession/:id')
  @ApiBearerAuth('backendToken')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Redis session id',
    required: true,
  })
  @ApiOperation({
    operationId: 'destroySession',
    summary: 'Destroy redis session',
    description:
      'Destroy session by redis session id, authorized to admin role or backend token only',
  })
  @ApiOkResponse({
    description: 'Destroyed redis session id',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must have admin role or backend token',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async destroySession(
    @Param('id') sessionId: string,
    @Session() session: ExpressSessionUser,
  ): Promise<void> {
    await this.accountService.destroySession(sessionId);
    const admin = session.user;

    this.logger.log(
      `[ADMIN - ${session.userId} ${admin.firstName} ${admin.lastName}] : Performing destroy session operation on session id - ${sessionId}`,
    );
  }

  // should delete this feature or place limitations as admin should not be able to edit user information
  @Put(':id')
  @ApiBearerAuth('backendToken')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Account id',
    required: true,
  })
  @ApiOperation({
    operationId: 'updateAccount',
    summary: 'Update account',
    description:
      'Update account by account id, authorized to admin role or backend token only',
  })
  @ApiOkResponse({
    description: 'Updated account profile of given account id',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must have admin role or backend token',
  })
  @ApiBadRequestResponse({
    description: 'Provided invalid data or failed validation',
  })
  @ApiOkResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async updateAccount(
    @Body(new ValidationPipe()) updateAccountDto: UpdateAccountDTO,
    @Param('id') accountId: string,
    @Session() session: ExpressSessionUser,
  ): Promise<AccountProfile> {
    const updatedAccountDetails: AccountProfile =
      await this.accountService.updateAccount(updateAccountDto, accountId);
    const admin = session.user;

    this.logger.log(
      `[ADMIN - ${session.userId} ${admin.firstName} ${admin.lastName}] : Performing update account operation on account id - ${accountId}`,
    );

    return updatedAccountDetails;
  }

  @Delete(':id')
  @ApiBearerAuth('backendToken')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Account id',
    required: true,
  })
  @ApiOperation({
    operationId: 'deleteAccount',
    summary: 'Delete account',
    description:
      'Delete account by account id, authorized to admin role or backend token only',
  })
  @ApiNoContentResponse({
    description: 'Delete account profile of given account id',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must have admin role or backend token',
  })
  @ApiBadRequestResponse({
    description: 'Provided invalid data.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteAccount(
    @Param('id') accountId: string,
    @Session() session: ExpressSessionUser,
  ): Promise<void> {
    const admin = session.user;
    await this.accountService.deleteAccount(accountId);

    this.logger.log(
      `[ADMIN - ${session.userId} ${admin.firstName} ${admin.lastName}] : Performing delete account operation on account id - ${accountId}`,
    );
  }
}
