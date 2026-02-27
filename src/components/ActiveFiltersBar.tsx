import { X } from 'lucide-react';
import { ProductFilters, ProductStatusFilter, BagAllocationFilter } from '@/types/cargo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActiveFiltersBarProps {
  filters: ProductFilters;
  onRemoveStatus: () => void;
  onRemoveOrder: (orderId: string) => void;
  onRemoveBagAllocation: () => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const statusLabels: Record<ProductStatusFilter, string> = {
  all: '',
  unchecked: 'Não conferidos',
  success: 'Conferidos OK',
  warning: 'Com atenção',
};

const bagAllocationLabels: Record<BagAllocationFilter, string> = {
  all: '',
  available: 'Disponíveis',
  partial: 'Parciais',
  allocated: 'Alocados',
};

export function ActiveFiltersBar({
  filters,
  onRemoveStatus,
  onRemoveOrder,
  onRemoveBagAllocation,
  onClearAll,
  hasActiveFilters,
}: ActiveFiltersBarProps) {
  if (!hasActiveFilters) return null;

  return (
    <div className="px-4 py-2 bg-muted/30 border-b flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground">Filtros:</span>
      
      {filters.status !== 'all' && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {statusLabels[filters.status]}
          <button
            onClick={onRemoveStatus}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      {filters.orders.map(orderId => (
        <Badge key={orderId} variant="secondary" className="gap-1 pr-1">
          Pedido {orderId}
          <button
            onClick={() => onRemoveOrder(orderId)}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {filters.bagAllocation !== 'all' && (
        <Badge variant="secondary" className="gap-1 pr-1">
          {bagAllocationLabels[filters.bagAllocation]}
          <button
            onClick={onRemoveBagAllocation}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        Limpar todos
      </Button>
    </div>
  );
}
