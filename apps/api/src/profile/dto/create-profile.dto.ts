// create-profile.dto.ts

import { IsOptional, IsString, IsPhoneNumber, MaxLength } from 'class-validator';

export class CreateProfileDto {

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