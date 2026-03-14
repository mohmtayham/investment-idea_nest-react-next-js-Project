import { Module } from '@nestjs/common';
import { FundingsService } from './fundings.service';
import { FundingsController } from './fundings.controller';

@Module({
  controllers: [FundingsController],
  providers: [FundingsService],
})
export class FundingsModule {}
