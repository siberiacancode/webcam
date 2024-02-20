import { LanguagesIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from './ui/button';

const LANGUAGES = {
  ru: 'русский',
  en: 'english'
};

interface LanguageSelectProps {
  value: keyof typeof LANGUAGES;
}

export const LanguageSelect = ({ value }: LanguageSelectProps) => {
  const onClick = (language: keyof typeof LANGUAGES) => {
    window.location.href = `/${language}${window.location.pathname.slice(3)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex justify-center gap-2'>
          <LanguagesIcon width='20' height='20' />
          <span className='hidden sm:block'>{LANGUAGES[value]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onClick('en')} className='flex justify-start gap-2'>
          <span>{LANGUAGES.en}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onClick('ru')} className='flex justify-start gap-2'>
          <span>{LANGUAGES.ru}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
