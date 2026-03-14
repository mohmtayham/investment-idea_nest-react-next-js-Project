import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GanttChartsService } from './gantt-charts.service';
import { CreateGanttChartDto } from './dto/create-gantt-chart.dto';
import { UpdateGanttChartDto } from './dto/update-gantt-chart.dto';

@Controller('gantt-charts')
export class GanttChartsController {
  constructor(private readonly ganttChartsService: GanttChartsService) {}

  @Post()
  create(@Body() createGanttChartDto: CreateGanttChartDto) {
    return this.ganttChartsService.create(createGanttChartDto);
  }

  @Get()
  findAll() {
    return this.ganttChartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ganttChartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGanttChartDto: UpdateGanttChartDto) {
    return this.ganttChartsService.update(+id, updateGanttChartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ganttChartsService.remove(+id);
  }
}
