import React from 'react';
import { ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const BreadcrumbItem = ({
  className,
  href,
  children,
  ...props
}: Omit<React.ComponentProps<'a'>, 'href'> & { href?: string }) =>
  !href ? (
    <span className={cn('text-base font-medium text-muted-foreground', className)} {...props} />
  ) : (
    <a
      className={cn('text-base font-medium text-muted-foreground', className)}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
BreadcrumbItem.displayName = 'BreadcrumbItem';

const Breadcrumbs = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, children, ...props }, ref) => (
    <ul ref={ref} className={cn('lgx:p-3 flex items-center pb-4', className)} {...props}>
      {React.Children.map(children, (child, index) => (
        <li className='flex'>
          {child}
          {index !== React.Children.count(children) - 1 && (
            <ChevronRightIcon className='mx-2 text-muted-foreground' />
          )}
        </li>
      ))}
    </ul>
  )
);
Breadcrumbs.displayName = 'Breadcrumbs';

export { BreadcrumbItem, Breadcrumbs };
