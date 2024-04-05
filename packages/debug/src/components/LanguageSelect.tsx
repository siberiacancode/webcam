import { LanguagesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
          <LanguagesIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
          <span className='hidden sm:block'>{LANGUAGES[value]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
