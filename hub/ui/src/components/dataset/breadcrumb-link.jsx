import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const BreadcrumbLink = forwardRef(
  ({ children, className, href, onMouseEnter, onMouseLeave }, ref) => (
    <Link
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      to={href}
      ref={ref}
    >
      {children}
    </Link>
  )
);

export default BreadcrumbLink;
