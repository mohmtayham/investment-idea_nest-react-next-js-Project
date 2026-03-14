import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 💡 أضف PrismaModule هنا
  controllers: [IdeasController],
  providers: [IdeasService],
})
export class IdeasModule {

  
}
