import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departments?: string[];
  selectedDepartment?: string;
  onDepartmentChange?: (dept: string) => void;
  suppliers?: string[];
  selectedSupplier?: string;
  onSupplierChange?: (supplier: string) => void;
  minCost?: number;
  maxCost?: number;
  onMinCostChange?: (cost: number) => void;
  onMaxCostChange?: (cost: number) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onClearFilters?: () => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  departments,
  selectedDepartment,
  onDepartmentChange,
  suppliers,
  selectedSupplier,
  onSupplierChange,
  minCost,
  maxCost,
  onMinCostChange,
  onMaxCostChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = 
    (selectedDepartment && selectedDepartment !== 'All') ||
    (selectedSupplier && selectedSupplier !== 'All') ||
    minCost ||
    maxCost ||
    startDate ||
    endDate;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground 
                           group-focus-within:text-primary transition-colors duration-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-11 pr-10 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                     border-2 border-border rounded-lg text-card-foreground 
                     focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                     hover:border-primary/50 transition-all duration-300 
                     placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full 
                       hover:bg-primary/20 text-muted-foreground hover:text-primary 
                       transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-300 
                   flex items-center gap-2 ${
            showFilters || hasActiveFilters
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background"></span>
          )}
        </button>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-primary">Filter Options</h4>
                {hasActiveFilters && onClearFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs text-muted-foreground hover:text-accent transition-colors duration-300
                             flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Department Filter */}
                {departments && onDepartmentChange && (
                  <div className="group">
                    <label className="block text-xs text-muted-foreground mb-2 group-focus-within:text-primary 
                                  transition-colors duration-300">Department</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => onDepartmentChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gradient-to-br from-secondary to-secondary/80 
                               border-2 border-border rounded-lg text-card-foreground text-sm
                               focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                               hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    >
                      <option value="All">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Supplier Filter */}
                {suppliers && onSupplierChange && (
                  <div className="group">
                    <label className="block text-xs text-muted-foreground mb-2 group-focus-within:text-primary 
                                  transition-colors duration-300">Supplier</label>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => onSupplierChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gradient-to-br from-secondary to-secondary/80 
                               border-2 border-border rounded-lg text-card-foreground text-sm
                               focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                               hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    >
                      <option value="All">All Suppliers</option>
                      {suppliers.map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Cost Range Filter */}
                {(onMinCostChange || onMaxCostChange) && (
                  <>
                    <div className="group">
                      <label className="block text-xs text-muted-foreground mb-2 group-focus-within:text-primary 
                                    transition-colors duration-300">Min Cost (KSh)</label>
                      <input
                        type="number"
                        value={minCost || ''}
                        onChange={(e) => onMinCostChange?.(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 bg-gradient-to-br from-secondary to-secondary/80 
                                 border-2 border-border rounded-lg text-card-foreground text-sm
                                 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                                 hover:border-primary/50 transition-all duration-300 
                                 placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs text-muted-foreground mb-2 group-focus-within:text-primary 
                                    transition-colors duration-300">Max Cost (KSh)</label>
                      <input
                        type="number"
                        value={maxCost || ''}
                        onChange={(e) => onMaxCostChange?.(parseFloat(e.target.value) || 0)}
                        placeholder="No limit"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 bg-gradient-to-br from-secondary to-secondary/80 
                                 border-2 border-border rounded-lg text-card-foreground text-sm
                                 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                                 hover:border-primary/50 transition-all duration-300 
                                 placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </>
                )}

                {/* Date Range Filter */}
                {(onStartDateChange || onEndDateChange) && (
                  <>
                    <div className="group">
                      <label className="block text-xs text-muted-foreground mb-2 group-focus-within:text-primary 
                                    transition-colors duration-300">From Date</label>
                      <input
                        type="date"
                        value={startDate || ''}
                        onChange={(e) => onStartDateChange?.(e.target.value)}
                        className="w-full px-3 py-2 bg-gradient-to-br from-secondary to-secondary/80 
                                 border-2 border-border rounded-lg text-card-foreground text-sm
                                 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                                 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs text-muted-foreground mb-2 group-focus-within:text-primary 
                                    transition-colors duration-300">To Date</label>
                      <input
                        type="date"
                        value={endDate || ''}
                        onChange={(e) => onEndDateChange?.(e.target.value)}
                        className="w-full px-3 py-2 bg-gradient-to-br from-secondary to-secondary/80 
                                 border-2 border-border rounded-lg text-card-foreground text-sm
                                 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                                 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
