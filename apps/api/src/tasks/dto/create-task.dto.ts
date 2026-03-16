import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTaskDto {

  @IsString()
  taskName: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  weight?: number;

  @IsInt()
  ganttId: number;
}