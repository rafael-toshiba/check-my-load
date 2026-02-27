import { motion } from 'framer-motion';
import { CheckCircle, Package, Camera, Truck, ArrowRight } from 'lucide-react';
import { Product, PhotoRecord } from '@/types/cargo';
import { Button } from '@/components/ui/button';

interface CompletionScreenProps {
  cargoId: string;
  products: Product[];
  photos: PhotoRecord[];
  onNewConference: () => void;
}

export function CompletionScreen({
  cargoId,
  products,
  photos,
  onNewConference,
}: CompletionScreenProps) {
  const totalQuantity = products.reduce((sum, p) => sum + (p.checkedQuantity || 0), 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto w-24 h-24 bg-success rounded-full flex items-center justify-center shadow-lg"
        >
          <CheckCircle className="w-14 h-14 text-success-foreground" />
        </motion.div>

        {/* Title */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground"
          >
            Conferência Concluída!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            Todos os produtos foram verificados com sucesso
          </motion.p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border shadow-lg overflow-hidden"
        >
          {/* Cargo Header */}
          <div className="bg-primary p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80">Carga</p>
              <p className="text-2xl font-bold text-primary-foreground">
                #{cargoId}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4">
            {/* Products */}
            <div className="flex items-center gap-4 p-3 bg-success-light rounded-xl">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Produtos Conferidos</p>
                <p className="font-bold text-lg">
                  {products.length} produtos • {totalQuantity} unidades
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>

            {/* Photos */}
            <div className="flex items-center gap-4 p-3 bg-success-light rounded-xl">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Fotos Registradas</p>
                <p className="font-bold text-lg">{photos.length} fotos</p>
              </div>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>

            {/* Photo Thumbnails */}
            <div className="flex gap-2 overflow-x-auto py-2">
              {photos.map((photo, index) => (
                <img
                  key={photo.id}
                  src={photo.imageData}
                  alt={`Foto ${index + 1}`}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border-2 border-success/30"
                />
              ))}
            </div>

            {/* Timestamp */}
            <div className="pt-3 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Concluído em{' '}
                <span className="font-medium">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* New Conference Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={onNewConference}
            className="w-full h-14 text-lg font-semibold"
          >
            Nova Conferência
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
