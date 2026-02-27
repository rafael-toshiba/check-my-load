import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductFilters } from '@/types/cargo';

interface ProductSearchBarProps {
  filters: ProductFilters;
  onSearchChange: (search: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
}

export function ProductSearchBar({
  filters,
  onSearchChange,
  onOpenFilters,
  activeFilterCount,
  filteredCount,
  totalCount,
}: ProductSearchBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync local search with filters
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Debounce search
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  const clearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="sticky top-[73px] z-30 bg-background border-b">
      <div className="p-3 space-y-2">
        {/* Search and Filter Row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar código ou descrição..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9 h-11"
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 relative"
            onClick={onOpenFilters}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Results Indicator */}
        {(filteredCount !== totalCount || filters.search) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Exibindo <span className="font-medium text-foreground">{filteredCount}</span> de{' '}
              <span className="font-medium text-foreground">{totalCount}</span> produtos
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
