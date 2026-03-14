import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FundingsService } from './fundings.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { UpdateFundingDto } from './dto/update-funding.dto';

@Controller('fundings')
export class FundingsController {
  constructor(private readonly fundingsService: FundingsService) {}

  @Post()
  create(@Body() createFundingDto: CreateFundingDto) {
    return this.fundingsService.create(createFundingDto);
  }

  @Get()
  findAll() {
    return this.fundingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFundingDto: UpdateFundingDto) {
    return this.fundingsService.update(+id, updateFundingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundingsService.remove(+id);
  }
}
