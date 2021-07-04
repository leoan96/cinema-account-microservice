export interface AccountProfile {
  id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  gender: string;
  phone: string;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  role?: [string];
}
