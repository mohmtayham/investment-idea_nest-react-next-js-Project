import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GanttChart } from 'src/gantt-charts/entities/gantt-chart.entity';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async createtaskinstidegantt(createTaskDto: CreateTaskDto,userId: number) {
const gantt =await  this.prisma.ganttChart.findUnique({
  where: { id: createTaskDto.ganttId },
  include: {
    idea:{
      include:{
        owner:true
      },
    },
  },
});

    if(!gantt){
      throw new NotFoundException('Gantt not found');
    }

  if(gantt.idea.owner.id !== userId){
  throw new ForbiddenException('You are not the owner of this idea');
}
  return this.prisma.task.create({
    data:{
    ...createTaskDto,
    },
  });
  
  
}

  


  findAll() {
    return `This action returns all tasks`;
  }

 async showAllTasksInSpecificGantt(ganttId: number, userId: number) {

  const gantt = await this.prisma.ganttChart.findUnique({
    where: { id: ganttId },
    include: {
      idea: {     
        include: {
          owner: true,
        },
      },
    },
  });

  if (!gantt) {
    throw new NotFoundException('Gantt not found');
  }

  if (gantt.idea.ownerId !== userId) {
    throw new ForbiddenException('You are not the owner of this idea');
  }

  const tasks = await this.prisma.task.findMany({
    where: {
      ganttId: ganttId,
    },
  });

  return {
    message: 'Tasks retrieved successfully',
    data: tasks,
  };
}



  update(id: number, updateTaskDto: UpdateTaskDto) {
 
  }
async updateGanttProgress(ganttId: number) {
    // 1. جلب المخطط مع مهامه من قاعدة البيانات
    const gantt = await this.prisma.ganttChart.findUnique({
      where: { id: ganttId },
      include: { tasks: true },
    });

    if (!gantt) {
      throw new NotFoundException('Gantt Chart not found');
    }

    const tasks = gantt.tasks;

    // 2. إذا لم يكن هناك مهام، نصفر النسبة
    if (tasks.length === 0) {
      return this.prisma.ganttChart.update({
        where: { id: ganttId },
        data: {
          progress: 0,
          approvalStatus: 'pending', // عدلتها لتطابق الـ Schema لديك
        },
      });
    }

    // 3. استخدام let بدلاً من const لأننا سنقوم بتغيير القيم
    let totalWeight:number = 0;                    
    let totalProgress:number = 0;

    tasks.forEach((task) => {
      totalWeight += task.weight;
      
      // بما أن الـ Task لديك لها حقل isCompleted (وليس progress نسبة مئوية)
      // نعتبر المهمة المكتملة 100% وغير المكتملة 0%
      const taskProgressPercentage = task.isCompleted ? 100 : 0;
      
      totalProgress += taskProgressPercentage * task.weight;
    });

    // 4. الحماية من القسمة على صفر وحساب النسبة النهائية
    const finalProgress = totalWeight > 0 ? Math.round(totalProgress / totalWeight) : 0;

    // 5. تحديث المخطط في قاعدة البيانات
    return this.prisma.ganttChart.update({
      where: { id: ganttId },
      data: {
        progress: finalProgress,
        // يمكنك تغيير الـ approvalStatus هنا إذا أردت بناءً على النسبة
        // approvalStatus: finalProgress === 100 ? 'approved' : gantt.approvalStatus,
      },
    });
  }
}
  