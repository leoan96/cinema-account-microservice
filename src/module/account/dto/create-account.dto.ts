export class CreateAccountDTO {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  language?: string;
}

export class CreateAccountRoleDTO extends CreateAccountDTO {
  role: [string];
}
