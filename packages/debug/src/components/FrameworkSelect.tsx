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
    icon: <img src={javascript.src} className='rounded' alt='javascript' width='20' height='20' />,
    name: 'javascript'
  },
  react: {
    icon: <img src={react.src} alt='react' width='20' height='20' />,
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
