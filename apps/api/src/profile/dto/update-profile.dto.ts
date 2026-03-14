// update-profile.dto.ts

import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}