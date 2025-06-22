import React, { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children?: ReactNode;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

const Table: React.FC<TableProps> = ({
  headers,
  children,
  className = '',
  emptyMessage = 'Nenhum dado encontrado',
  isLoading = false,
}) => {
  return (
    <div
      className={`w-full overflow-x-hidden rounded-lg border ${className}`}
      style={{ borderColor: 'var(--cor-borda)' }}
    >
      <table className="w-full table-fixed divide-y" style={{ borderColor: 'var(--cor-borda)' }}>
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--cor-texto-secundario)' }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y" style={{ borderColor: 'var(--cor-borda)' }}>
          {isLoading && (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                <div className="flex justify-center items-center py-4">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Carregando...</span>
                </div>
              </td>
            </tr>
          )}
          {!isLoading && React.Children.count(children) > 0 && children}
          {!isLoading && React.Children.count(children) === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<{ children: ReactNode; className?: string } & React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tr
      className={`odd:bg-gray-50 hover:bg-[var(--cor-secundaria)/10] hover:shadow-sm rounded-lg ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<{ children: ReactNode; className?: string; compact?: boolean }> = ({
  children,
  className = '',
  compact = false,
}) => {
  const padding = compact ? 'px-2 py-2' : 'px-6 py-4';
  return (
    <td className={`${padding} text-sm ${className}`} style={{ color: 'var(--cor-texto-secundario)' }}>
      {children}
    </td>
  );
};

export default Table;
