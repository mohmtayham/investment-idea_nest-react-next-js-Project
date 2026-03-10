import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // هذه الكلمة تجعل الخدمة متاحة لكل المشروع بنسخة واحدة
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}