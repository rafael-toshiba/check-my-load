import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Loader2, Flashlight, X } from 'lucide-react'; // <-- Importamos o 'X' para o botão de fechar
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
  const [isTorchOn, setIsTorchOn] = useState(false);

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
    setIsTorchOn(false);

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
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
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

  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    try {
      const newState = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newState }] as any
      });
      setIsTorchOn(newState);
    } catch (err) {
      console.error('A câmera não suporta lanterna ou permissão negada:', err);
    }
  };

  return (
    <div className="w-full">
      {/* BOTÃO INICIAL: Só aparece quando o scanner está desligado */}
      {!isActive && (
        <Button
          type="button"
          variant="outline"
          onClick={onToggle}
          className="w-full"
          disabled={isLoading}
        >
          <Camera className="w-4 h-4 mr-2" />
          Escanear Código de Barras
        </Button>
      )}

      {/* OVERLAY TELA CHEIA: Só aparece quando o scanner está ligado */}
      {isActive && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black bg-opacity-95 backdrop-blur-sm">
          
          {/* HEADER (Controles no Topo) */}
          <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-[110] bg-gradient-to-b from-black/80 to-transparent">
            <Button
              type="button"
              variant="ghost"
              onClick={onToggle}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <X className="w-6 h-6 mr-2" />
              Fechar
            </Button>

            {!isLoading && !error && (
              <Button
                type="button"
                variant="ghost"
                onClick={toggleTorch}
                className="text-white hover:bg-white/20"
                title="Ligar Lanterna"
              >
                <Flashlight className={`w-6 h-6 ${isTorchOn ? 'text-yellow-400 fill-yellow-400' : ''}`} />
              </Button>
            )}
          </div>

         {/* ÁREA DE LEITURA (Centro da tela) */}
          <div className="flex-1 flex flex-col items-center justify-center w-full h-full mt-16 px-4 pb-8 relative">
            
            {/* Overlay de Loading posicionado de forma absoluta sobre a área preta */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-lg font-medium">Acessando câmera...</p>
              </div>
            )}

            {error && (
              <div className="bg-destructive text-destructive-foreground p-4 rounded-lg text-center max-w-sm z-10">
                <p className="mb-4">{error}</p>
                <Button variant="secondary" onClick={onToggle} className="w-full">
                  Voltar
                </Button>
              </div>
            )}

            {/* O Container do Leitor agora só fica hidden em caso de ERRO. 
                Durante o loading ele fica visível (como um bloco preto) para calcular o tamanho do vídeo corretamente */}
            <div
              id="barcode-reader"
              className={`w-full max-w-md overflow-hidden rounded-xl shadow-2xl bg-black ${error ? 'hidden' : 'block'} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            />

            {!isLoading && !error && (
              <div className="mt-8 text-center text-white/80">
                <p>Centralize o código de barras na área demarcada acima</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}