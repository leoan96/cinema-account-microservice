import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/role/role.decorator';
import { Role } from 'src/guard/role/role.enum';
import { RoleGuard } from 'src/guard/role/role.guard';
import { UpdateAccountDTO } from '../dto/update-account-profile.dto';
import { AccountProfile } from '../interface/account-profile.interface';
import { AccountService } from '../account.service';

@Controller('/account/admin')
export class AccountAdminController {
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
  async getAccountById(@Param('id') theId: string): Promise<AccountProfile> {
    return await this.accountService.getAccountById(theId);
  }

  @Get('destroySession/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async destroySession(@Param('id') sessionid: string): Promise<void> {
    await this.accountService.destroySession(sessionid);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async updateAccount(
    @Body() updateAccountDto: UpdateAccountDTO,
    @Param('id') theId: string,
  ): Promise<AccountProfile> {
    return await this.accountService.updateAccount(updateAccountDto, theId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteAccount(@Param('id') theId: string): Promise<void> {
    await this.accountService.deleteAccount(theId);
  }
}
