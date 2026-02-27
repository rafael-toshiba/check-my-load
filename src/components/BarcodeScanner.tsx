import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, Loader2, Flashlight } from 'lucide-react'; // <-- Importe o Flashlight
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

export function BarcodeScanner({ onScan, isActive, onToggle }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false); // <-- NOVO: Estado da lanterna

  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isActive]);

  const startScanner = async () => {
    setIsLoading(true);
    setError(null);
    setIsTorchOn(false); // Garante que começa desligada no visual

    try {
      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 100 },
          aspectRatio: 1.5,
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
          onToggle();
        },
        () => {
          // Ignore scan failures
        }
      );
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Não foi possível acessar a câmera');
      onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        setIsTorchOn(false);
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Ignore stop errors
      }
      scannerRef.current = null;
    }
  };

  // <-- NOVA FUNÇÃO: Ligar/Desligar Flash
  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    try {
      const newState = !isTorchOn;
      // Aplica a restrição de vídeo nativa da câmera do dispositivo
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newState }] as any // 'any' necessário pois a tipagem nativa pode ser rígida
      });
      setIsTorchOn(newState);
    } catch (err) {
      console.error('A câmera não suporta lanterna ou permissão negada:', err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Container flex para colocar os botões lado a lado */}
      <div className="flex gap-2"> 
        <Button
          type="button"
          variant={isActive ? 'destructive' : 'outline'}
          onClick={onToggle}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isActive ? (
            <CameraOff className="w-4 h-4 mr-2" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          {isLoading
            ? 'Iniciando câmera...'
            : isActive
            ? 'Parar Scanner'
            : 'Escanear Código de Barras'}
        </Button>

        {/* Botão da Lanterna só aparece se a câmera estiver ativa */}
        {isActive && !isLoading && (
          <Button
            type="button"
            variant={isTorchOn ? 'default' : 'outline'}
            onClick={toggleTorch}
            className="px-3"
            title="Ligar Lanterna"
          >
            <Flashlight className={`w-5 h-5 ${isTorchOn ? 'text-yellow-400' : ''}`} />
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div
        id="barcode-reader"
        className={`overflow-hidden rounded-lg ${isActive ? 'block' : 'hidden'}`}
        style={{ width: '100%' }}
      />
    </div>
  );
}