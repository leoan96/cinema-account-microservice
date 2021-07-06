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
  @IsString()
  @Length(0, 747)
  firstName: string;

  @IsString()
  @Length(0, 747)
  lastName: string;

  @IsString()
  @Length(8, 50)
  password: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @Length(11, 12)
  phone: string;

  @IsString()
  @IsIn(['female', 'male'])
  gender: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  avatar: string;

  @IsString()
  @IsIn(['en', 'cn', 'ms'])
  language?: string;
}

export class CreateAccountRoleDTO extends CreateAccountDTO {
  role: [string];
}
