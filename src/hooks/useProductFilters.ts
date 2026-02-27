import { useState, useCallback, useMemo } from 'react';
import { Product, ProductFilters, ProductStatusFilter, BagAllocationFilter, Bag } from '@/types/cargo';

const initialFilters: ProductFilters = {
  search: '',
  status: 'all',
  orders: [],
  bagAllocation: 'all',
};

export function useProductFilters(
  products: Product[],
  bags: Bag[],
  getProductAvailability: (code: string) => { total: number; inBags: number; available: number }
) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setStatus = useCallback((status: ProductStatusFilter) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setOrders = useCallback((orders: string[]) => {
    setFilters(prev => ({ ...prev, orders }));
  }, []);

  const setBagAllocation = useCallback((bagAllocation: BagAllocationFilter) => {
    setFilters(prev => ({ ...prev, bagAllocation }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.orders.length > 0 ||
      filters.bagAllocation !== 'all'
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.orders.length > 0) count++;
    if (filters.bagAllocation !== 'all') count++;
    return count;
  }, [filters]);

  const getProductStatus = useCallback((product: Product): 'unchecked' | 'success' | 'warning' => {
    if (!product.isChecked) return 'unchecked';
    return product.checkedQuantity === product.totalQuantity ? 'success' : 'warning';
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesCode = product.code.toLowerCase().includes(searchLower);
        const matchesDescription = product.description.toLowerCase().includes(searchLower);
        if (!matchesCode && !matchesDescription) return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        const status = getProductStatus(product);
        if (status !== filters.status) return false;
      }

      // Order filter
      if (filters.orders.length > 0) {
        const productOrders = product.orders.map(o => o.orderId);
        const hasMatchingOrder = filters.orders.some(o => productOrders.includes(o));
        if (!hasMatchingOrder) return false;
      }

      // Bag allocation filter
      if (filters.bagAllocation !== 'all') {
        const availability = getProductAvailability(product.code);
        
        if (filters.bagAllocation === 'available') {
          // Not in any bag at all
          if (availability.inBags > 0) return false;
        } else if (filters.bagAllocation === 'partial') {
          // Some in bags, some available
          if (!(availability.inBags > 0 && availability.available > 0)) return false;
        } else if (filters.bagAllocation === 'allocated') {
          // All in bags
          if (availability.available > 0) return false;
        }
      }

      return true;
    });
  }, [products, filters, getProductStatus, getProductAvailability]);

  // Get unique orders from all products
  const availableOrders = useMemo(() => {
    const ordersSet = new Set<string>();
    products.forEach(product => {
      product.orders.forEach(order => ordersSet.add(order.orderId));
    });
    return Array.from(ordersSet).sort();
  }, [products]);

  return {
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
    totalProducts: products.length,
  };
}
