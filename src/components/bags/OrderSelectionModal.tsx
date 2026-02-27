import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, ShoppingBag, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types/cargo';

interface OrderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: { orderId: string; products: { code: string; quantity: number }[] }[];
  products: Product[];
  getOrderAvailability: (orderId: string) => { hasAvailable: boolean; allInBags: boolean };
  onSelectOrders: (orderIds: string[]) => void;
}

export function OrderSelectionModal({
  isOpen,
  onClose,
  orders,
  products,
  getOrderAvailability,
  onSelectOrders,
}: OrderSelectionModalProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleProceed = () => {
    if (selectedOrders.length > 0) {
      onSelectOrders(selectedOrders);
    }
  };

  const getOrderProductCount = (orderId: string) => {
    return orders.find(o => o.orderId === orderId)?.products.length ?? 0;
  };

  const getOrderTotalQuantity = (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    return order?.products.reduce((sum, p) => sum + p.quantity, 0) ?? 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Selecionar Pedidos</h2>
              <p className="text-sm text-muted-foreground">
                Escolha os pedidos para a sacola
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.map((order) => {
            const availability = getOrderAvailability(order.orderId);
            const isDisabled = availability.allInBags || !availability.hasAvailable;
            const isSelected = selectedOrders.includes(order.orderId);

            return (
              <motion.div
                key={order.orderId}
                whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                onClick={() => !isDisabled && handleToggleOrder(order.orderId)}
                className={`
                  p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${isDisabled 
                    ? 'bg-muted/50 border-muted opacity-60 cursor-not-allowed' 
                    : isSelected 
                      ? 'bg-primary/5 border-primary' 
                      : 'bg-card border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Pedido {order.orderId}</h3>
                      {isDisabled && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Em sacolas
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {getOrderProductCount(order.orderId)} produtos
                      </span>
                      <span>
                        {getOrderTotalQuantity(order.orderId)} unidades
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum pedido disponível</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {selectedOrders.length} pedido(s) selecionado(s)
            </span>
          </div>
          <Button
            onClick={handleProceed}
            disabled={selectedOrders.length === 0}
            className="w-full h-12"
          >
            Selecionar Produtos
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
