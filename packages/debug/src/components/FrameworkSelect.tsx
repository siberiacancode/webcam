import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from './ui/button';
import react from "../assets/images/react-original.svg";
import javascript from "@/assets/images/javascript-original.svg";

const FRAMEWORKS = {
  javascript: {
    icon: <img src={javascript.src} className='rounded' alt="javascript" width="20" height="20" />,
    name: 'javascript'
  },
  react: {
    icon: <img src={react.src} alt="react" width="20" height="20" />,
    name: 'react'
  }
};

interface FrameworkSelectProps {
  value: keyof typeof FRAMEWORKS;
}

export const FrameworkSelect = ({ value }: FrameworkSelectProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='outline' className='flex w-32 justify-center gap-2'>
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
