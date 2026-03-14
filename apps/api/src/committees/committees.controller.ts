import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommitteesService } from './committees.service';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';

@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Post()
  create(@Body() createCommitteeDto: CreateCommitteeDto) {
    return this.committeesService.create(createCommitteeDto);
  }

  @Get()
  findAll() {
    return this.committeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.committeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommitteeDto: UpdateCommitteeDto) {
    return this.committeesService.update(+id, updateCommitteeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.committeesService.remove(+id);
  }
}
