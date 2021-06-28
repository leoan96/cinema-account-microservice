export interface AccountProfile {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
