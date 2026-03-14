import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BusinessPlansService } from './business-plans.service';
import { CreateBusinessPlanDto } from './dto/create-business-plan.dto';
import { UpdateBusinessPlanDto } from './dto/update-business-plan.dto';

@Controller('business-plans')
export class BusinessPlansController {
  constructor(private readonly businessPlansService: BusinessPlansService) {}

  @Post()
  create(@Body() createBusinessPlanDto: CreateBusinessPlanDto) {
    return this.businessPlansService.create(createBusinessPlanDto);
  }

  @Get()
  findAll() {
    return this.businessPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessPlansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessPlanDto: UpdateBusinessPlanDto) {
    return this.businessPlansService.update(+id, updateBusinessPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessPlansService.remove(+id);
  }
}
