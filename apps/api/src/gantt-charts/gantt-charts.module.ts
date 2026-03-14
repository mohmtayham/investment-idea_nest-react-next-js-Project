import { Module } from '@nestjs/common';
import { GanttChartsService } from './gantt-charts.service';
import { GanttChartsController } from './gantt-charts.controller';

@Module({
  controllers: [GanttChartsController],
  providers: [GanttChartsService],
})
export class GanttChartsModule {}
