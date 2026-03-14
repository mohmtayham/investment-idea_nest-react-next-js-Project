import { Injectable } from '@nestjs/common';
import { CreateBusinessPlanDto } from './dto/create-business-plan.dto';
import { UpdateBusinessPlanDto } from './dto/update-business-plan.dto';

@Injectable()
export class BusinessPlansService {
  create(createBusinessPlanDto: CreateBusinessPlanDto) {
    return 'This action adds a new businessPlan';
  }

  findAll() {
    return `This action returns all businessPlans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessPlan`;
  }

  update(id: number, updateBusinessPlanDto: UpdateBusinessPlanDto) {
    return `This action updates a #${id} businessPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessPlan`;
  }
}
