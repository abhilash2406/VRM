import React from 'react';
import DataTable, { createTheme } from 'react-data-table-component';

// Define the common theme used across all tables
createTheme(
  'solarized',
  {
    text: { primary: '#f8fafc', secondary: '#94a3b8' },
    background: { default: 'transparent' },
    context: { background: '#cb4b16', text: '#FFFFFF' },
    divider: { default: 'rgba(255, 255, 255, 0.1)' },
    action: {
      button: 'rgba(255,255,255,.54)',
      hover: 'rgba(255,255,255,.08)',
      disabled: 'rgba(255,255,255,.12)',
    },
  },
  'dark'
);

/**
 * A wrapper around react-data-table-component that applies our common styles,
 * themes, and default pagination options so we don't have to repeat them.
 */
const AppDataTable = (props) => {
  return (
    <DataTable
      pagination
      paginationRowsPerPageOptions={[10, 25, 50, 100]}
      theme="solarized"
      {...props}
    />
  );
};

export default AppDataTable;
