import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const LANGUAGES = ['ru', 'en'];
export const generateAlternate = (path: string) => {
  return LANGUAGES.map((language) => ({
    href: `${import.meta.env.DOMAIN}/${language}${path}`,
    hreflang: language
  }));
};
