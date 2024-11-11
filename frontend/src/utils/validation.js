import { emailRegex, nameRegex } from './regex';

export const isValidEmail = (email) => emailRegex.test(email);

export function isAlphabetic(str) {
    return nameRegex.test(str);
}