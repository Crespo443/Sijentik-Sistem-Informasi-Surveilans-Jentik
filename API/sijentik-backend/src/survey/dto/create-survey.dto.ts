import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

enum ContainerCategory {
  DAILY = 'DAILY',
  NON_DAILY = 'NON_DAILY',
  NATURAL = 'NATURAL',
}

class SurveyContainerDto {
  @IsEnum(ContainerCategory)
  category: ContainerCategory;

  @IsString()
  @IsNotEmpty()
  containerName: string;

  @IsInt()
  inspectedCount: number;

  @IsInt()
  positiveCount: number;
}

class SurveyInterventionDto {
  @IsString()
  @IsNotEmpty()
  activityName: string;

  @IsNotEmpty()
  isDone: boolean;
}

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  houseOwner: string;

  @IsString()
  @IsNotEmpty()
  villageId: string;

  @IsDateString()
  surveyDate: string;

  @IsOptional()
  @IsString()
  rtRw: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsInt()
  occupantCount: number;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  notes: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyContainerDto)
  containers: SurveyContainerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyInterventionDto)
  interventions: SurveyInterventionDto[];
}
