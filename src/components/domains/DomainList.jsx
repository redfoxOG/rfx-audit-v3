
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DomainListItem from '@/components/domains/DomainListItem';

const DomainList = ({ domains, onEdit, onDelete, onRunAudit }) => {
  if (!domains || domains.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 font-fira-code">
        <p>// No targets acquired.</p>
        <p>// Add your first target to begin surveillance.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Target</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Last Scan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.map((domain) => (
          <DomainListItem
            key={domain.id}
            domain={domain}
            onEdit={onEdit}
            onDelete={onDelete}
            onRunAudit={onRunAudit}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default DomainList;
