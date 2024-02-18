import { Breadcrumbs as _Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import React from 'react';

interface BreadcrumbsProps {
  items: React.ComponentProps<typeof BreadcrumbItem>[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <_Breadcrumbs>
    {items.map((item, index) => (
      <BreadcrumbItem key={index} {...item} />
    ))}
  </_Breadcrumbs>
);
