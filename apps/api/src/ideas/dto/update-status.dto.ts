// src/ideas/dto/update-status.dto.ts
import { IdeaStatus } from '@prisma/client';   // بدون /wasm
import { IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn([
    'SUBMITTED',
    'UNDER_REVIEW',
    'NEEDS_REVISION',
    'APPROVED',
    'REJECTED',
    'PAUSED_FOR_PAYMENT'
  ])
  status: IdeaStatus;
}