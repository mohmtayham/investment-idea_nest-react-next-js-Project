import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      const request = context.switchToHttp().getRequest();
      console.log('--- [Guard Check] ---');
      console.log(`Target: ${context.getClass().name} -> ${context.getHandler().name}`);
      console.log(`Key searched: ${IS_PUBLIC_KEY}`);
      console.log(`Is Public found? ${isPublic}`);

      if (isPublic) {
        console.log('✅ Access Granted: Public Route');
        return true;
      }

      console.log('🔒 Access Restricted: Token Required');
      return super.canActivate(context);
    } catch (err) {
      console.error('❌ Error in JwtAuthGuard:', err.message);
      throw new UnauthorizedException();
    }
  }
}