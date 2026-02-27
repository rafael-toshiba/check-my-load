import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, Bag, BagProduct, PhotoRecord } from '@/types/cargo';
import { OrderSelectionModal } from './OrderSelectionModal';
import { ProductSelectionModal } from './ProductSelectionModal';
import { BagRegistrationModal } from './BagRegistrationModal';
import { toast } from 'sonner';

type FlowStep = 'orders' | 'products' | 'registration';

interface BagCreationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  orders: { orderId: string; products: { code: string; quantity: number }[] }[];
  products: Product[];
  bags: Bag[];
  getOrderAvailability: (orderId: string) => { hasAvailable: boolean; allInBags: boolean };
  getProductAvailability: (code: string) => { total: number; inBags: number; available: number };
  isBagCodeUsed: (code: string) => boolean;
  onCreateBag: (bag: Bag) => void;
}

export function BagCreationFlow({
  isOpen,
  onClose,
  orders,
  products,
  bags,
  getOrderAvailability,
  getProductAvailability,
  isBagCodeUsed,
  onCreateBag,
}: BagCreationFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('orders');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<BagProduct[]>([]);

  const handleClose = () => {
    setCurrentStep('orders');
    setSelectedOrders([]);
    setSelectedProducts([]);
    onClose();
  };

  const handleSelectOrders = (orderIds: string[]) => {
    setSelectedOrders(orderIds);
    setCurrentStep('products');
  };

  const handleBackToOrders = () => {
    setSelectedProducts([]);
    setCurrentStep('orders');
  };

  const handleConfirmProducts = (prods: BagProduct[]) => {
    setSelectedProducts(prods);
    setCurrentStep('registration');
  };

  const handleBackToProducts = () => {
    setCurrentStep('products');
  };

  const handleConfirmBag = (bagCode: string, photos: PhotoRecord[]) => {
    const newBag: Bag = {
      id: bagCode,
      createdAt: new Date().toISOString(),
      orders: selectedOrders,
      products: selectedProducts,
      photos,
    };
    
    onCreateBag(newBag);
    toast.success('Sacola criada com sucesso!', {
      description: `${selectedProducts.length} produtos • ${selectedProducts.reduce((s, p) => s + p.quantity, 0)} unidades`,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'orders' && (
        <OrderSelectionModal
          key="orders"
          isOpen={true}
          onClose={handleClose}
          orders={orders}
          products={products}
          getOrderAvailability={getOrderAvailability}
          onSelectOrders={handleSelectOrders}
        />
      )}

      {currentStep === 'products' && (
        <ProductSelectionModal
          key="products"
          isOpen={true}
          onClose={handleClose}
          onBack={handleBackToOrders}
          selectedOrders={selectedOrders}
          products={products}
          bags={bags}
          getProductAvailability={getProductAvailability}
          onConfirmProducts={handleConfirmProducts}
        />
      )}

      {currentStep === 'registration' && (
        <BagRegistrationModal
          key="registration"
          isOpen={true}
          onClose={handleClose}
          onBack={handleBackToProducts}
          selectedProducts={selectedProducts}
          selectedOrders={selectedOrders}
          isBagCodeUsed={isBagCodeUsed}
          onConfirmBag={handleConfirmBag}
        />
      )}
    </AnimatePresence>
  );
}
