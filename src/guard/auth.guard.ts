import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    return this.validateSession(request);
  }

  private validateSession(request: Request): boolean {
    const token = request.headers.authorization?.split(' ')[1];
    const backendToken = this.configService.get<string>('BACKEND_TOKEN');

    return !!request.session['userId'] || backendToken === token;
  }
}
