// src/auth/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // استيراد ConfigService
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import type { AuthJwtPayload } from '../types/auth-jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // حقن ConfigService بدلاً من ConfigType مباشرة في super
    private readonly configService: ConfigService, 
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // استخدم configService لجلب المفتاح السري
     secretOrKey: configService.get<string>('JWT_SECRET')!, // لاحظ علامة التعجب

    });
  }

  async validate(payload: AuthJwtPayload) {
    // يمكنك الآن استخدام this.authService بأمان
    return this.authService.validateJwtUser(payload.sub);
  }
}
