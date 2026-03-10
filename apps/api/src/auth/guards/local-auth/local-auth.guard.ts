import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// استخدم extends بدلاً من implements
export class LocalAuthGuard extends AuthGuard('local') {}