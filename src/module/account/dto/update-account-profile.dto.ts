import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    description: 'first name',
    type: 'string',
    example: 'Frank',
  })
  @IsString()
  @Length(0, 747)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'last name',
    type: 'string',
    example: 'Gordan',
  })
  @IsString()
  @Length(0, 747)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'password',
    type: 'string',
    example: '5hh#I$KPCfdqD8b1r5S7rlHY0',
  })
  @IsString()
  @Length(8, 50)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'email',
    type: 'string',
    example: 'frank@gmail.com',
  })
  @IsEmail()
  @MaxLength(50)
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'phone',
    type: 'string',
    example: '341-393-134',
  })
  @IsString()
  @Length(11, 12)
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'gender',
    type: 'string',
    enum: ['female', 'male'],
    example: 'female',
  })
  @IsString()
  @IsIn(['female', 'male'])
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    description: 'avatar link',
    type: 'string',
    example: 'https://image.flaticon.com/icons/png/512/2922/2922688.png',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'language',
    type: 'string',
    example: 'en',
  })
  @IsString()
  @IsIn(['en', 'cn', 'ms'])
  @IsOptional()
  language?: string;

  // remove ability to update createdAt updatedAt in the future
  @ApiPropertyOptional({
    description: 'created at',
    type: 'string',
    example: '2021-07-06T07:36:34.394Z',
  })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'updated at',
    type: 'string',
    example: '2021-07-06T07:36:34.394Z',
  })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
