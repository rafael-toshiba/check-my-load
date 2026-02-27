import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Package, Camera, Trash2, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bag } from '@/types/cargo';

interface BagListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bags: Bag[];
  onRemoveBag: (bagId: string) => void;
}

export function BagListModal({
  isOpen,
  onClose,
  bags,
  onRemoveBag,
}: BagListModalProps) {
  const [expandedBag, setExpandedBag] = useState<string | null>(null);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeleteBag = (bagId: string) => {
    onRemoveBag(bagId);
    setConfirmDelete(null);
  };

  return (
    <>
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
                <h2 className="text-lg font-bold">Sacolas Criadas</h2>
                <p className="text-sm text-muted-foreground">
                  {bags.length} sacola(s) registrada(s)
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

          {/* Bag List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bags.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma sacola criada ainda</p>
              </div>
            ) : (
              bags.map((bag) => {
                const isExpanded = expandedBag === bag.id;
                const totalQty = bag.products.reduce((sum, p) => sum + p.quantity, 0);
                
                return (
                  <motion.div
                    key={bag.id}
                    className="bg-card border rounded-xl overflow-hidden"
                  >
                    {/* Bag Header */}
                    <div
                      onClick={() => setExpandedBag(isExpanded ? null : bag.id)}
                      className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          Sacola {bag.id.slice(0, 12)}...
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            {bag.products.length} produtos
                          </span>
                          <span>{totalQty} un.</span>
                          <span className="flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" />
                            {bag.photos.length}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4">
                            {/* Orders */}
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Pedidos</p>
                              <p className="text-sm font-medium">{bag.orders.join(', ')}</p>
                            </div>

                            {/* Products */}
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Produtos</p>
                              <div className="space-y-1">
                                {bag.products.map(p => (
                                  <div key={p.code} className="flex justify-between text-sm bg-muted/50 px-2 py-1 rounded">
                                    <span>#{p.code}</span>
                                    <span className="font-medium">{p.quantity} un.</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Photos */}
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Fotos</p>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {bag.photos.map((photo, idx) => (
                                  <div
                                    key={photo.id}
                                    className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => setFullscreenPhoto(photo.imageData)}
                                  >
                                    <img
                                      src={photo.imageData}
                                      alt={`Foto ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <Maximize2 className="w-4 h-4 text-white opacity-0 hover:opacity-100" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delete Button */}
                            {confirmDelete === bag.id ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleDeleteBag(bag.id)}
                                >
                                  Confirmar exclusão
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setConfirmDelete(null)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setConfirmDelete(bag.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir Sacola
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button onClick={onClose} variant="outline" className="w-full">
              Fechar
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Photo */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
            onClick={() => setFullscreenPhoto(null)}
          >
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullscreenPhoto}
              alt="Foto ampliada"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
