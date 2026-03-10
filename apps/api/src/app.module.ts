import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core'; // استيراد ضروري جداً
import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard'; // تأكد من صحة هذا المسار

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // تفعيل الحماية عالمياً وربطها بالـ Reflector
    },
  ],
})
export class AppModule {}