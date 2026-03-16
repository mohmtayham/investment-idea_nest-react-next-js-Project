import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRoadmapDto } from './create-roadmap.dto';

export class UpdateRoadmapDto extends PartialType(
  OmitType(CreateRoadmapDto, ['ideaId'] as const)
) {}