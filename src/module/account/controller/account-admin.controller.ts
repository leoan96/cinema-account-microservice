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

@Controller('/account/admin')
export class AccountAdminController {
  private readonly logger = new Logger(AccountAdminController.name);

  constructor(private readonly accountService: AccountService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllAccounts(): Promise<AccountProfile[]> {
    return await this.accountService.getAllAccounts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async getAccountById(
    @Param('id') accountId: string,
  ): Promise<AccountProfile> {
    return await this.accountService.getAccountById(accountId);
  }

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
