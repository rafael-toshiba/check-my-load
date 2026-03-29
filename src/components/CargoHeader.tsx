import { Truck, MapPin, Hash, CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Cargo } from '@/types/cargo';

interface CargoHeaderProps {
  cargo: Cargo;
}

export function CargoHeader({ cargo }: CargoHeaderProps) {
  // Formatação amigável da data/hora
  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  return (
    <Card className="p-3 mb-4 bg-muted/30 border-dashed">
      <div className="flex flex-wrap gap-2 items-center justify-start">
        <Badge variant="default" className="flex items-center gap-1 text-sm py-1">
          <Hash className="w-3.5 h-3.5" />
          {cargo.id}
        </Badge>
        
        <Badge variant="outline" className="flex items-center gap-1 text-sm py-1 bg-background">
          <Truck className="w-3.5 h-3.5 text-muted-foreground" />
          {cargo.licensePlate}
        </Badge>

        {cargo.dock && (
          <Badge variant="outline" className="flex items-center gap-1 text-sm py-1 bg-background">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            Doca {cargo.dock}
          </Badge>
        )}

        {cargo.seqCarga && (
          <Badge variant="secondary" className="flex items-center gap-1 text-sm py-1">
            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
            Seq: {cargo.seqCarga}
          </Badge>
        )}

        {cargo.horaSaida && (
          <Badge variant="secondary" className="flex items-center gap-1 text-sm py-1">
            <CalendarClock className="w-3.5 h-3.5 text-muted-foreground" />
            {formatDateTime(cargo.horaSaida)}
          </Badge>
        )}
      </div>
    </Card>
  );
}