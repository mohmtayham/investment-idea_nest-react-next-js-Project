import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // هذه الحماية تمنع الاتصال المتكرر في حال تم استدعاء الخدمة من أكثر من مكان
    if (!this.$connect['called']) {
      await this.$connect();
      this.logger.log('✅ Connected to the database successfully');
      this.$connect['called'] = true;
    }
  }
}