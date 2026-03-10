import { Injectable } from '@nestjs/common';
import { sayHello } from '@repo/utils';

@Injectable()
export class AppService {
  getHello(): string {
    return sayHello();
  }
}