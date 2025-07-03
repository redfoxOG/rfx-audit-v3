import React from 'react';
import { motion } from 'framer-motion';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Play, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const DomainListItem = ({ domain, onEdit, onDelete, onRunAudit }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewLastReport = async () => {
    const { data: latestAudit, error } = await supabase
      .from('audits')
      .select('id')
      .eq('domain_id', domain.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latestAudit) {
      navigate(`/assessment/${latestAudit.id}`);
    } else {
      toast({ title: "No Assessment Found", description: "No assessment has been performed for this target yet.", variant: "destructive" });
    }
  };
  
  const getStatusPill = (status) => {
    switch (status) {
      case 'Completed': return <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-neon-green border border-neon-green/30">Completed</span>;
      case 'Pending': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/50 text-yellow-400 border border-yellow-400/30">Pending</span>;
      case 'Auditing': return <span className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-400 border border-blue-400/30 animate-pulse">Scanning...</span>;
      case 'Failed': return <span className="px-2 py-1 text-xs rounded-full bg-red-900/50 text-crimson border border-crimson/30">Failed</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-gray-400 border border-gray-400/30">{status || 'Unknown'}</span>;
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-crimson/5"
    >
      <TableCell className="font-bold text-gray-200">{domain.name}</TableCell>
      <TableCell className="capitalize">{domain.schedule}</TableCell>
      <TableCell>{domain.last_audit ? new Date(domain.last_audit).toLocaleDateString() : 'Never'}</TableCell>
      <TableCell>
        {getStatusPill(domain.status)}
      </TableCell>
      <TableCell className="text-right space-x-1">
        <Button variant="ghost" size="icon" onClick={() => onRunAudit(domain.id)} title="Run Scan" disabled={domain.status === 'Auditing'}>
          <Play className="h-4 w-4 text-neon-green" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleViewLastReport} title="View Last Assessment">
          <Eye className="h-4 w-4 text-blue-400" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(domain)} title="Edit Target">
          <Edit className="h-4 w-4 text-yellow-400" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(domain.id)} title="Delete Target">
          <Trash2 className="h-4 w-4 text-crimson" />
        </Button>
      </TableCell>
    </motion.tr>
  );
};

export default DomainListItem;