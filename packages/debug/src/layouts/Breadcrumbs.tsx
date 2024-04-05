import React from 'react';

import { BreadcrumbItem, Breadcrumbs as BaseBreadcrumbs } from '@/components/ui/breadcrumbs';

interface BreadcrumbsProps {
  items: React.ComponentProps<typeof BreadcrumbItem>[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <BaseBreadcrumbs className='flex flex-wrap'>
    {items.map((item, index) => (
      <BreadcrumbItem key={index} {...item} />
    ))}
  </BaseBreadcrumbs>
);
