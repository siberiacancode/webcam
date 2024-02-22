import React from 'react';

import { BreadcrumbItem, Breadcrumbs as _Breadcrumbs } from '@/components/ui/breadcrumbs';

interface BreadcrumbsProps {
  items: React.ComponentProps<typeof BreadcrumbItem>[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <_Breadcrumbs className='flex flex-wrap'>
    {items.map((item, index) => (
      <BreadcrumbItem key={index} {...item} />
    ))}
  </_Breadcrumbs>
);
