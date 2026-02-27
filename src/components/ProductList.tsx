import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Package, ArrowRight, ShoppingBag, Eye, PackageSearch, CornerDownLeft } from 'lucide-react';
import { Product, Bag, ActionType } from '@/types/cargo';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { VerificationModal } from './VerificationModal';
import { BagCreationFlow } from './bags/BagCreationFlow';
import { BagListModal } from './bags/BagListModal';
import { ProductSearchBar } from './ProductSearchBar';
import { ProductFiltersDrawer } from './ProductFiltersDrawer';
import { ActiveFiltersBar } from './ActiveFiltersBar';
import { ActionHistoryDrawer } from './ActionHistoryDrawer';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useProductFilters } from '@/hooks/useProductFilters';
import { toast } from 'sonner';
import { ActionHistoryEntry } from '@/types/cargo';

interface ProductListProps {
  cargoId: string;
  products: Product[];
  bags: Bag[];
  onBack: () => void;
  onUpdateProduct: (code: string, quantity: number) => void;
  onSave: () => void;
  onProceed: () => void;
  onAddBag: (bag: Bag) => void;
  onRemoveBag: (bagId: string) => void;
  getOrderAvailability: (orderId: string) => { hasAvailable: boolean; allInBags: boolean };
  getProductAvailability: (code: string) => { total: number; inBags: number; available: number };
  getOrdersForCargo: () => { orderId: string; products: { code: string; quantity: number }[] }[];
  isBagCodeUsed: (code: string) => boolean;
  stats: {
    total: number;
    checked: number;
    successful: number;
    warnings: number;
  };
  canProceed: boolean;
  actionHistory: ActionHistoryEntry[];
  onAddHistoryEntry: (type: ActionType, description: string, metadata?: Record<string, unknown>) => void;
  onClearHistory: () => void;
  /** Brand names being verified in this session */
  selectedBrands?: string[];
}

export function ProductList({
  cargoId,
  products,
  bags,
  onBack,
  onUpdateProduct,
  onSave,
  onProceed,
  onAddBag,
  onRemoveBag,
  getOrderAvailability,
  getProductAvailability,
  getOrdersForCargo,
  isBagCodeUsed,
  stats,
  canProceed,
  actionHistory,
  onAddHistoryEntry,
  onClearHistory,
  selectedBrands,
}: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBagFlowOpen, setIsBagFlowOpen] = useState(false);
  const [isBagListOpen, setIsBagListOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showProceedWarning, setShowProceedWarning] = useState(false);

  const {
    filters,
    setSearch,
    setStatus,
    setOrders,
    setBagAllocation,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    filteredProducts,
    availableOrders,
    totalProducts,
  } = useProductFilters(products, bags, getProductAvailability);

  const allChecked = stats.checked === stats.total;
  const isBrandMode = selectedBrands && selectedBrands.length > 0;
  const brandLabel = isBrandMode
    ? selectedBrands.length === 1 ? selectedBrands[0] : `${selectedBrands.length} marcas`
    : null;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirm = (code: string, quantity: number) => {
    const product = products.find(p => p.code === code);
    onUpdateProduct(code, quantity);
    
    const isMatch = product?.totalQuantity === quantity;
    
    if (isMatch) {
      onAddHistoryEntry('product_checked', `Produto #${code} conferido - ${quantity} unidades`, {
        productCode: code,
        quantity,
      });
      toast.success('Produto conferido!', {
        description: `#${code} - ${quantity} unidades`,
      });
    } else {
      onAddHistoryEntry('product_warning', `Produto #${code} com atenção - esperado ${product?.totalQuantity}, conferido ${quantity}`, {
        productCode: code,
        expected: product?.totalQuantity,
        actual: quantity,
      });
      toast.warning('Quantidade divergente!', {
        description: `Esperado: ${product?.totalQuantity}, Conferido: ${quantity}`,
      });
    }
  };

  const handleSave = () => {
    onSave();
    onAddHistoryEntry('progress_saved', 'Progresso salvo');
    toast.success('Progresso salvo!', {
      description: 'Você pode continuar depois de onde parou.',
    });
  };

  const handleProceed = () => {
    if (stats.warnings > 0) {
      setShowProceedWarning(true);
    } else {
      onProceed();
    }
  };

  const handleBagCreated = (bag: Bag) => {
    onAddBag(bag);
    onAddHistoryEntry('bag_created', `Sacola #${bag.id} criada - ${bag.products.length} produtos, ${bag.orders.length} pedidos`, {
      bagId: bag.id,
      productCount: bag.products.length,
      orderCount: bag.orders.length,
    });
  };

  const handleBagRemoved = (bagId: string) => {
    onRemoveBag(bagId);
    onAddHistoryEntry('bag_deleted', `Sacola #${bagId} excluída`, {
      bagId,
    });
  };

  const progressPercentage = (stats.checked / stats.total) * 100;
  const orders = getOrdersForCargo();
  const hasCheckedProducts = stats.checked > 0;

  // Footer button logic for brand mode
  const getFooterButtonState = () => {
    // Prioridade 1: Divergências bloqueiam saída
    if (stats.warnings > 0) {
      return {
        label: 'Resolver divergências',
        variant: 'default' as const,
        disabled: false,
      };
    }

    // Prioridade 2: Marca 100% conferida (sucesso)
    if (stats.checked === stats.total) {
      return {
        label: 'Concluir Marca',
        variant: 'default' as const,
        disabled: false,
        showCheckIcon: true,
      };
    }

    // Prioridade 3: Marca com pendências (em andamento)
    return {
      label: 'Salvar e Voltar',
      variant: 'outline' as const,
      disabled: false,
    };
  };

  const footerButtonState = getFooterButtonState();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-lg">Carga #{cargoId}</h1>
            <p className="text-xs text-muted-foreground">
              {brandLabel ? `${brandLabel} · ` : ''}{stats.checked}/{stats.total} conferidos
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ActionHistoryDrawer
              history={actionHistory}
              onClear={onClearHistory}
            />
            <button
              onClick={handleSave}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-primary"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className={`h-full transition-colors ${
              stats.warnings > 0 ? 'bg-warning' : 'bg-success'
            }`}
          />
        </div>
      </header>

      {/* Search Bar */}
      <ProductSearchBar
        filters={filters}
        onSearchChange={setSearch}
        onOpenFilters={() => setIsFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
        filteredCount={filteredProducts.length}
        totalCount={totalProducts}
      />

      {/* Active Filters */}
      <ActiveFiltersBar
        filters={filters}
        onRemoveStatus={() => setStatus('all')}
        onRemoveOrder={(orderId) => setOrders(filters.orders.filter(o => o !== orderId))}
        onRemoveBagAllocation={() => setBagAllocation('all')}
        onClearAll={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-3 border text-center">
          <Package className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-2xl font-bold">{stats.total - stats.checked}</p>
          <p className="text-xs text-muted-foreground">Pendentes</p>
        </div>
        <div className="bg-success-light rounded-xl p-3 border border-success/30 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-success" />
          <p className="text-2xl font-bold text-success">{stats.successful}</p>
          <p className="text-xs text-success">Conferidos OK</p>
        </div>
        <div className="bg-warning-light rounded-xl p-3 border border-warning/30 text-center">
          <AlertCircle className="w-5 h-5 mx-auto mb-1 text-warning" />
          <p className="text-2xl font-bold text-warning">{stats.warnings}</p>
          <p className="text-xs text-warning-foreground">Atenção</p>
        </div>
      </div>

      {/* Bag Actions */}
      {hasCheckedProducts && (
        <div className="px-4 pb-4 flex gap-3">
          <Button
            onClick={() => setIsBagFlowOpen(true)}
            variant="outline"
            className="flex-1 h-12 border-primary/50 text-primary hover:bg-primary/5"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Criar Sacola
          </Button>
          {bags.length > 0 && (
            <Button
              onClick={() => setIsBagListOpen(true)}
              variant="outline"
              className="h-12"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver ({bags.length})
            </Button>
          )}
        </div>
      )}

      {/* Product List */}
      <div className="flex-1 p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <PackageSearch className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-medium">
                Nenhum produto encontrado
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters 
                  ? 'Tente ajustar os filtros'
                  : 'Nenhum produto corresponde à busca'}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-4"
                >
                  Limpar filtros
                </Button>
              )}
            </motion.div>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.code}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.02 }}
              >
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                  index={index}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 bg-card border-t shadow-lg">
        <Button
          onClick={handleProceed}
          disabled={footerButtonState.disabled}
          variant={footerButtonState.variant}
          className="w-full h-14 text-lg font-semibold"
        >
          {footerButtonState.showCheckIcon && (
            <CheckCircle className="w-5 h-5 mr-2" />
          )}
          {footerButtonState.label}
        </Button>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />

      {/* Bag Creation Flow */}
      <BagCreationFlow
        isOpen={isBagFlowOpen}
        onClose={() => setIsBagFlowOpen(false)}
        orders={orders}
        products={products}
        bags={bags}
        getOrderAvailability={getOrderAvailability}
        getProductAvailability={getProductAvailability}
        isBagCodeUsed={isBagCodeUsed}
        onCreateBag={handleBagCreated}
      />

      {/* Bag List Modal */}
      <BagListModal
        isOpen={isBagListOpen}
        onClose={() => setIsBagListOpen(false)}
        bags={bags}
        onRemoveBag={handleBagRemoved}
      />

      {/* Filters Drawer */}
      <ProductFiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        availableOrders={availableOrders}
        onStatusChange={setStatus}
        onOrdersChange={setOrders}
        onBagAllocationChange={setBagAllocation}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Proceed Warning Dialog */}
      <ConfirmationDialog
        open={showProceedWarning}
        onOpenChange={setShowProceedWarning}
        title="Atenção: Produtos com Divergência"
        description={`Existem ${stats.warnings} produto(s) com quantidade divergente. Deseja prosseguir mesmo assim?`}
        details={
          <ul className="space-y-1">
            {products
              .filter(p => p.isChecked && p.checkedQuantity !== p.totalQuantity)
              .map(p => (
                <li key={p.code} className="flex justify-between">
                  <span>#{p.code}</span>
                  <span className="text-warning">
                    {p.checkedQuantity} / {p.totalQuantity}
                  </span>
                </li>
              ))}
          </ul>
        }
        variant="warning"
        confirmLabel="Prosseguir"
        cancelLabel="Revisar"
        onConfirm={() => {
          setShowProceedWarning(false);
          onProceed();
        }}
      />
    </div>
  );
}
