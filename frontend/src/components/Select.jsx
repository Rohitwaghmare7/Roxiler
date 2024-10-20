import React from 'react';

const Select = ({ children, className, ...props }) => (
  <select
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  >
    {children}
  </select>
);

const SelectItem = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);

export { Select, SelectItem };