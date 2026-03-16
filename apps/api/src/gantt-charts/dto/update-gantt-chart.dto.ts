import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateGanttChartDto } from './create-gantt-chart.dto';

// نستخدم PartialType مع OmitType لإزالة ideaId لأنه لا يمكن تغييره بعد الإنشاء
export class UpdateGanttChartDto extends PartialType(
  OmitType(CreateGanttChartDto, ['ideaId'] as const)
) {}