import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateRoadmapDto {
  @IsInt()
  ideaId: number;

  @IsString()
  currentStage: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;
}