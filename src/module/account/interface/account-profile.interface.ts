export interface AccountProfile {
  id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  phone: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: [string];
}
