import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

// custom validation (https://dev.to/avantar/custom-validation-with-database-in-nestjs-gao)
export class CreateAccountDTO {
  @ApiProperty({ description: 'first name', type: 'string', example: 'Arvy' })
  @IsString()
  @Length(0, 747)
  firstName: string;

  @ApiProperty({
    description: 'last name',
    type: 'string',
    example: 'Pomfrey',
  })
  @IsString()
  @Length(0, 747)
  lastName: string;

  @ApiProperty({
    description: 'password',
    type: 'string',
    example: '2YAphqhvpu&!cFq5zL27Bwe*D@Xpi9',
  })
  @IsString()
  @Length(8, 50)
  password: string;

  @ApiProperty({
    description: 'email',
    type: 'string',
    example: 'apomfrey0@paypal.com',
  })
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'phone',
    type: 'string',
    example: '233-117-9340',
  })
  @IsString()
  @Length(11, 12)
  phone: string;

  @ApiProperty({
    description: 'gender',
    type: 'string',
    enum: ['female', 'male'],
    example: 'female',
  })
  @IsString()
  @IsIn(['female', 'male'])
  gender: string;

  @ApiPropertyOptional({
    description: 'avatar',
    type: 'string',
    example: 'https://image.flaticon.com/icons/png/512/2922/2922688.png',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  avatar: string;

  @ApiPropertyOptional({
    description: 'language',
    type: 'string',
    example: 'en',
  })
  @IsString()
  @IsOptional()
  @IsIn(['en', 'cn', 'ms'])
  language?: string;
}

export class CreateAccountRoleDTO extends CreateAccountDTO {
  role: [string];
}
