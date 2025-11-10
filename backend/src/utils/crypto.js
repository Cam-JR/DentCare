import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.AES_KEY;

export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, key).toString();
};

export const decryptPassword = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
