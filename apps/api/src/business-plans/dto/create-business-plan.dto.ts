import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { BusinessPlanStatus } from '@prisma/client';

export class CreateBusinessPlanDto {

  @IsInt()
  ideaId: number;

  @IsOptional()
  @IsString()
  keyPartners?: string;

  @IsOptional()
  @IsString()
  keyActivities?: string;

  @IsOptional()
  @IsString()
  keyResources?: string;

  @IsOptional()
  @IsString()
  valueProposition?: string;

  @IsOptional()
  @IsString()
  customerRelationships?: string;

  @IsOptional()
  @IsString()
  channels?: string;

  @IsOptional()
  @IsString()
  customerSegments?: string;

  @IsOptional()
  @IsString()
  costStructure?: string;

  @IsOptional()
  @IsString()
  revenueStreams?: string;

  @IsOptional()
  @IsEnum(BusinessPlanStatus)
  status?: BusinessPlanStatus;
}