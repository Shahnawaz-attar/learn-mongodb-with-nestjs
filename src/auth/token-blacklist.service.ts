// src/auth/token-blacklist.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: string[] = [];

  async blacklistToken(token: string): Promise<void> {
    this.blacklistedTokens.push(token);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklistedTokens.includes(token);
  }
}
