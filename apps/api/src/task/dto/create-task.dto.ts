import { IsISO8601, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsISO8601()
  dueAt: string;

  @IsString()
  @IsOptional()
  productId?: string;
}
