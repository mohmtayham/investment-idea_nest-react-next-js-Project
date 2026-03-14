import { Injectable } from '@nestjs/common';
import { CreateGanttChartDto } from './dto/create-gantt-chart.dto';
import { UpdateGanttChartDto } from './dto/update-gantt-chart.dto';

@Injectable()
export class GanttChartsService {
  create(createGanttChartDto: CreateGanttChartDto) {
    return 'This action adds a new ganttChart';
  }

  findAll() {
    return `This action returns all ganttCharts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ganttChart`;
  }

  update(id: number, updateGanttChartDto: UpdateGanttChartDto) {
    return `This action updates a #${id} ganttChart`;
  }

  remove(id: number) {
    return `This action removes a #${id} ganttChart`;
  }
}
