import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Filter, Trash2, X, CheckCircle, AlertTriangle, Package, Save, Camera, Target, Rocket } from 'lucide-react';
import { ActionHistoryEntry, ActionType } from '@/types/cargo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface ActionHistoryDrawerProps {
  history: ActionHistoryEntry[];
  onClear: () => void;
}

const iconComponents: Record<ActionType, React.ReactNode> = {
  product_checked: <CheckCircle className="w-4 h-4 text-success" />,
  product_warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  bag_created: <Package className="w-4 h-4 text-primary" />,
  bag_deleted: <Trash2 className="w-4 h-4 text-destructive" />,
  progress_saved: <Save className="w-4 h-4 text-muted-foreground" />,
  photo_captured: <Camera className="w-4 h-4 text-primary" />,
  conference_completed: <Target className="w-4 h-4 text-success" />,
  conference_started: <Rocket className="w-4 h-4 text-primary" />,
};

const typeLabels: Record<ActionType, string> = {
  product_checked: 'Produto conferido',
  product_warning: 'Atenção',
  bag_created: 'Sacola criada',
  bag_deleted: 'Sacola excluída',
  progress_saved: 'Progresso salvo',
  photo_captured: 'Foto capturada',
  conference_completed: 'Conferência finalizada',
  conference_started: 'Conferência iniciada',
};

export function ActionHistoryDrawer({ history, onClear }: ActionHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState<ActionType[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const filteredHistory = history.filter(entry => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!entry.description.toLowerCase().includes(query)) return false;
    }

    // Type filter
    if (filterTypes.length > 0) {
      if (!filterTypes.includes(entry.type)) return false;
    }

    return true;
  });

  const toggleTypeFilter = (type: ActionType) => {
    setFilterTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Group by date
  const groupedHistory = filteredHistory.reduce((acc, entry) => {
    const dateKey = formatDate(entry.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, ActionHistoryEntry[]>);

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
            <Clock className="w-5 h-5" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {history.length > 99 ? '99+' : history.length}
              </span>
            )}
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Histórico de Ações
            </DrawerTitle>
            <DrawerDescription>
              {history.length} ações registradas
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar no histórico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(typeLabels) as ActionType[]).map(type => (
                <Badge
                  key={type}
                  variant={filterTypes.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTypeFilter(type)}
                >
                  <span className="mr-1">{iconComponents[type]}</span>
                  {typeLabels[type]}
                </Badge>
              ))}
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto space-y-4 -mx-4 px-4">
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {history.length === 0
                    ? 'Nenhuma ação registrada ainda'
                    : 'Nenhuma ação corresponde aos filtros'}
                </div>
              ) : (
                Object.entries(groupedHistory).map(([date, entries]) => (
                  <div key={date}>
                    <div className="text-xs font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
                      {date}
                    </div>
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {entries.map((entry) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="mt-0.5">
                              {iconComponents[entry.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-tight">
                                {entry.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatTime(entry.timestamp)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DrawerFooter className="border-t">
            <div className="flex gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Fechar
                </Button>
              </DrawerClose>
              <Button
                variant="destructive"
                onClick={() => setShowClearConfirm(true)}
                disabled={history.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Histórico</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja limpar todo o histórico de ações?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClear();
                setShowClearConfirm(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
