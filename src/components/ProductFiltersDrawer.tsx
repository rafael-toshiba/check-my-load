import { motion } from 'framer-motion';
import { X, Package, CheckCircle, AlertTriangle, Circle, ShoppingBag, Filter } from 'lucide-react';
import { ProductFilters, ProductStatusFilter, BagAllocationFilter } from '@/types/cargo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  availableOrders: string[];
  onStatusChange: (status: ProductStatusFilter) => void;
  onOrdersChange: (orders: string[]) => void;
  onBagAllocationChange: (allocation: BagAllocationFilter) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const statusOptions: { value: ProductStatusFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'all', label: 'Todos', icon: <Package className="w-4 h-4" />, color: '' },
  { value: 'unchecked', label: 'Não conferidos', icon: <Circle className="w-4 h-4" />, color: 'text-muted-foreground' },
  { value: 'success', label: 'Conferidos OK', icon: <CheckCircle className="w-4 h-4" />, color: 'text-success' },
  { value: 'warning', label: 'Com atenção', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-warning' },
];

const bagAllocationOptions: { value: BagAllocationFilter; label: string; description: string }[] = [
  { value: 'all', label: 'Todos', description: 'Mostrar todos os produtos' },
  { value: 'available', label: 'Disponíveis', description: 'Não estão em sacolas' },
  { value: 'partial', label: 'Parcialmente alocados', description: 'Algumas unidades em sacolas' },
  { value: 'allocated', label: 'Totalmente alocados', description: 'Todas unidades em sacolas' },
];

export function ProductFiltersDrawer({
  isOpen,
  onClose,
  filters,
  availableOrders,
  onStatusChange,
  onOrdersChange,
  onBagAllocationChange,
  onReset,
  hasActiveFilters,
}: ProductFiltersDrawerProps) {

  const handleOrderToggle = (orderId: string) => {
    const newOrders = filters.orders.includes(orderId)
      ? filters.orders.filter(o => o !== orderId)
      : [...filters.orders, orderId];
    onOrdersChange(newOrders);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </DrawerTitle>
          <DrawerDescription>
            Filtre os produtos para facilitar a busca
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Status Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Status do Produto</h4>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-left ${
                    filters.status === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className={option.color}>{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Filter */}
          {availableOrders.length > 0 && (
            <>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filtrar por Pedido</h4>
                <div className="space-y-2">
                  {availableOrders.map(orderId => (
                    <div
                      key={orderId}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`order-${orderId}`}
                        checked={filters.orders.includes(orderId)}
                        onCheckedChange={() => handleOrderToggle(orderId)}
                      />
                      <Label
                        htmlFor={`order-${orderId}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        Pedido {orderId}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Bag Allocation Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Alocação em Sacolas
            </h4>
            <div className="space-y-2">
              {bagAllocationOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onBagAllocationChange(option.value)}
                  className={`w-full flex flex-col items-start p-3 rounded-lg border transition-colors text-left ${
                    filters.bagAllocation === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onReset}
                className="flex-1"
              >
                Limpar filtros
              </Button>
            )}
            <DrawerClose asChild>
              <Button className="flex-1">
                Aplicar
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
