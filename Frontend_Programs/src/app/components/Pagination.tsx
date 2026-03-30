import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border
                   text-card-foreground hover:border-primary/50 hover:bg-primary/10
                   transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:border-border disabled:hover:bg-card"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border
                   text-card-foreground hover:border-primary/50 hover:bg-primary/10
                   transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:border-border disabled:hover:bg-card"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
