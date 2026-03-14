import { PartialType } from '@nestjs/mapped-types';
import { CreateGanttChartDto } from './create-gantt-chart.dto';

export class UpdateGanttChartDto extends PartialType(CreateGanttChartDto) {}
