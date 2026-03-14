import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });

    console.log('JWT STRATEGY INITIALIZED');
  }

async validate(payload: any) {
  console.log('--- [JwtStrategy] validate called with payload ---');
  console.log('Payload:', payload);
  return {
    id: payload.sub,
    role: payload.role,
  };
}
}