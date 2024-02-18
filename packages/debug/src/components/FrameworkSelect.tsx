import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sun } from 'lucide-react';
import { Button } from './ui/button';

const FRAMEWORKS = {
  javascript: {
    icon: (
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
    ),
    name: 'javascript'
  },
  react: {
    icon: (
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
    ),
    name: 'react'
  }
};

interface FrameworkSelectProps {
  value: keyof typeof FRAMEWORKS;
}

export const FrameworkSelect = ({ value }: FrameworkSelectProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='outline' className='w-32 flex justify-center gap-2'>
        {FRAMEWORKS[value].icon}
        <span>{FRAMEWORKS[value].name}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end'>
      <a href='/javascript'>
        <DropdownMenuItem className='flex justify-start gap-2'>
          {FRAMEWORKS.javascript.icon}
          <span>{FRAMEWORKS.javascript.name}</span>
        </DropdownMenuItem>
      </a>
      <a href='/react'>
        <DropdownMenuItem className='flex justify-start gap-2'>
          {FRAMEWORKS.react.icon}
          <span>{FRAMEWORKS.react.name}</span>
        </DropdownMenuItem>
      </a>
    </DropdownMenuContent>
  </DropdownMenu>
);
