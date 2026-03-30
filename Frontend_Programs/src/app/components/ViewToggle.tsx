import { LayoutGrid, Table } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'card' | 'table';
  onViewChange: (view: 'card' | 'table') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="relative">
      <label className="text-sm text-muted-foreground mr-2">View:</label>
      <select
        value={currentView}
        onChange={(e) => onViewChange(e.target.value as 'card' | 'table')}
        className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-card-foreground 
                   hover:border-primary/50 transition-all duration-300 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="card">Card View</option>
        <option value="table">Table View</option>
      </select>
    </div>
  );
}
