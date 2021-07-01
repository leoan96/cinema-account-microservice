import * as bcrypt from 'bcrypt';

export const hashPassword = async (oldPassword: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(oldPassword, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
