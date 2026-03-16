import { Injectable, NotFoundException, BadRequestException,ForbiddenException } from '@nestjs/common';
import { CreateGanttChartDto } from './dto/create-gantt-chart.dto';
import { UpdateGanttChartDto } from './dto/update-gantt-chart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IdeasService } from 'src/ideas/ideas.service';
import { CommitteesService } from 'src/committees/committees.service';
import { NotificationsService } from 'src/notifications/notifications.service';


@Injectable()
export class GanttChartsService {
  constructor(private prisma: PrismaService) {}

  async create(createGanttChartDto: CreateGanttChartDto) {
    const { ideaId, startDate, endDate } = createGanttChartDto;

    // التحقق من أن تاريخ البداية قبل تاريخ النهاية
    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    // التحقق من وجود الفكرة
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },

  
      include: {
        businessPlans: true,
        committee: { include: { members: true } }
      }
   } );

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }
    


    // إنشاء مخطط جانت
    return this.prisma.ganttChart.create({
      data: {
        ...createGanttChartDto, // يحتوي على جميع الحقول بما فيها ideaId
      },
      include: {
        idea: true, // تضمين بيانات الفكرة في النتيجة
      },
    });

    
  }

  async findAll() {
    return this.prisma.ganttChart.findMany({
      include: {
        idea: true, // تضمين بيانات الفكرة في النتيجة
      },
    });
  }
  async findOne(id: number) {
    const ganttChart = await this.prisma.ganttChart.findUnique({
      where: { id },
      include: {
        idea: true, // تضمين بيانات الفكرة في النتيجة
      },
    });
    if (!ganttChart) {
      throw new NotFoundException('Gantt chart not found');
    }
    return ganttChart;
  }
  async update(id: number, updateGanttChartDto: UpdateGanttChartDto) {
    const { startDate, endDate } = updateGanttChartDto;
    // التحقق من أن تاريخ البداية قبل تاريخ النهاية
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    } 
    // التحقق من وجود مخطط جانت
    const existingGanttChart = await this.prisma.ganttChart.findUnique({
      where: { id },
    });
    if (!existingGanttChart) {
      throw new NotFoundException('Gantt chart not found');
    }
    // تحديث مخطط جانت
    return this.prisma.ganttChart.update({
      where: { id },
      data: { 
        ...updateGanttChartDto, // يحتوي على الحقول التي تم تحديثها
      },
      include: {
        idea: true, // تضمين بيانات الفكرة في النتيجة
      },
    });
  } 
  async remove(id: number) {
  const existingGanttChart =await  this.prisma.ganttChart.findUnique({

  where: { id },
  });
  if (!existingGanttChart) {
    throw new NotFoundException('Gantt chart not found');
  }

    return this.prisma.ganttChart.delete({
      where: { id },
    });
  } 

// Equivalent to your Laravel index()
  async getGanttCharts(ideaId: number, userId: number) {
    if (!ideaId) {
      throw new BadRequestException('يجب تحديد الفكرة.');
    }

    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        ganttCharts: { include: { tasks: true } },
        // FIX 1: Use 'members', as defined in the Committee model
        committee: { include: { members: true } }, 
      },
    });

    if (!idea) {
      throw new NotFoundException('الفكرة غير موجودة.');
    }

    // FIX 2: Use ownerId, not owner_id
    const isOwner = idea.ownerId === userId; 
    
    // FIX 3: Iterate over 'members' and check 'userId', not 'user_id'
    const isCommitteeMember = idea.committee?.members.some(
      (member) => member.userId === userId 
    );

    if (!isOwner && !isCommitteeMember) {
      throw new ForbiddenException('ليس لديك صلاحية الوصول إلى هذه الفكرة.');
    }

    return {
      message: 'تم جلب المراحل بنجاح',
      data: idea.ganttCharts,
    };
  }

  // Equivalent to your Laravel getCommitteeIdeaGanttCharts()
  async getCommitteeGanttCharts(ideaId: number, userId: number) {
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        ganttCharts: { include: { tasks: true } },
        // FIX 1: Use 'members' here as well
        committee: { include: { members: true } }, 
      },
    });

    if (!idea) {
      throw new NotFoundException('الفكرة غير موجودة.');
    }

    // FIX 3: Iterate over 'members' and check 'userId'
    const isCommitteeMember = idea.committee?.members.some(
      (member) => member.userId === userId 
    );

    if (!isCommitteeMember) {
      throw new ForbiddenException('ليس لديك صلاحية الوصول إلى هذه الفكرة.');
    }

    return {
      message: 'تم جلب المراحل والمهام بنجاح',
      data: idea.ganttCharts,
    };
  }



}