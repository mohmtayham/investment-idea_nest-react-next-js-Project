import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBusinessPlanDto } from './create-business-plan.dto';

export class UpdateBusinessPlanDto extends PartialType( 

  OmitType(CreateBusinessPlanDto, ['ideaId'] as const)
){}

