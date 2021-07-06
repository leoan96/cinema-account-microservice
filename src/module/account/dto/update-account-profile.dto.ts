import {
  IsDate,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateAccountDTO {
  @IsString()
  @Length(0, 747)
  @IsOptional()
  firstName?: string;

  @IsString()
  @Length(0, 747)
  @IsOptional()
  lastName?: string;

  @IsString()
  @Length(8, 50)
  @IsOptional()
  password?: string;

  @IsEmail()
  @MaxLength(50)
  @IsOptional()
  email?: string;

  @IsString()
  @Length(11, 12)
  @IsOptional()
  phone?: string;

  @IsString()
  @IsIn(['female', 'male'])
  @IsOptional()
  gender: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsIn(['en', 'cn', 'ms'])
  @IsOptional()
  language?: string;

  // remove ability to update createdAt updatedAt in the future
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
