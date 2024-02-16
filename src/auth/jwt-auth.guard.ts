// src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);
    if (await this.tokenBlacklistService.isTokenBlacklisted(token)) {
      return false; // Token is blacklisted, so access is denied
    }

    return super.canActivate(context) as boolean;
  }

  private extractJwtFromRequest(request: any): string {
    const authorizationHeader = request.headers.authorization;
    return authorizationHeader ? authorizationHeader.split(' ')[1] : null;
  }
}
