import javascript from '@/assets/images/javascript-original.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import react from '../assets/images/react-original.svg';

import { Button } from './ui/button';

const FRAMEWORKS = {
  javascript: {
    icon: (
      <img
        src={javascript.src}
        alt='javascript'
        className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 rounded transition-all'
      />
    ),
    name: 'javascript'
  },
  react: {
    icon: (
      <img
        src={react.src}
        alt='react'
        className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 rounded transition-all'
      />
    ),
    name: 'react'
  }
};

interface FrameworkSelectProps {
  value: keyof typeof FRAMEWORKS;
}

export const FrameworkSelect = ({ value }: FrameworkSelectProps) => {
  const onClick = (framework: keyof typeof FRAMEWORKS) => {
    const [, lang] = window.location.pathname.split('/');
    window.location.href = `/${lang}/${framework}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex justify-center gap-2'>
          {FRAMEWORKS[value].icon}
          <span className='hidden sm:block'>{FRAMEWORKS[value].name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => onClick('javascript')}
          className='flex justify-start gap-2'
        >
          {FRAMEWORKS.javascript.icon}
          <span>{FRAMEWORKS.javascript.name}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onClick('react')} className='flex justify-start gap-2'>
          {FRAMEWORKS.react.icon}
          <span>{FRAMEWORKS.react.name}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
