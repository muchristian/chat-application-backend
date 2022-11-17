import * as bcrypt from "bcrypt";

export const hashPassword = async (plainText) => {
  const hash = await bcrypt.hash(plainText, 10);
  return hash;
};

export const comparePassword = async (plainText, hash) => {
  const result = await bcrypt.compare(plainText, hash);
  return result;
};
