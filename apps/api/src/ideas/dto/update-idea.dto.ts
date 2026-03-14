// src/ideas/dto/update-idea.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateIdeaDto } from './create-idea.dto';
import { IsBoolean, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {
  // You can add additional fields that are only for updates
  // Or override validation rules if needed
  
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  target_audience?: string;

  @IsOptional()
  @IsString()
  additional_notes?: string;

  @IsOptional()
  @IsBoolean()
  terms_accepted?: boolean;
}