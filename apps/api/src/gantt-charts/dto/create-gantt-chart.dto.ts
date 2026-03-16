import { IsString, IsInt, IsDateString, Min, Max, IsOptional, IsNumber } from 'class-validator';

export class CreateGanttChartDto {
  @IsInt()
  ideaId: number;

  @IsString()
  phaseName: string;

  @IsDateString()
  startDate: string; // أو Date، ولكن DateString أسهل للـ API

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  failureCount?: number;

  @IsOptional()
  @IsString()
  approvalStatus?: string; // عادةً "pending", "approved", "rejected"
}