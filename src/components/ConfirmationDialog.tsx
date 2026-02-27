import { AlertTriangle, Trash2, CheckCircle, Info } from 'lucide-react';
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
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  details?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  details,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const icons = {
    default: <CheckCircle className="w-10 h-10 text-primary" />,
    destructive: <Trash2 className="w-10 h-10 text-destructive" />,
    warning: <AlertTriangle className="w-10 h-10 text-warning" />,
  };

  const buttonStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            {icons[variant]}
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {details && (
          <div className="my-4 p-3 bg-muted rounded-lg text-sm">
            {details}
          </div>
        )}
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`w-full sm:w-auto ${buttonStyles[variant]}`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
