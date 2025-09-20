import React from 'react';
import { Button } from '../../components/ui/Button';

interface Props {
  from?: string;
  to?: string;
}

export const ExportButtons: React.FC<Props> = ({ from, to }) => {
  const handleExport = (format: 'csv' | 'pdf') => {
    // Replace with actual API call
    window.open(`/api/reports/export?type=workorder&from=${from}&to=${to}&format=${format}`, '_blank');
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="ghost" onClick={() => handleExport('csv')}>Export CSV</Button>
      <Button variant="ghost" onClick={() => handleExport('pdf')}>Export PDF</Button>
    </div>
  );
};
