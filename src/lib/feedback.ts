export function playFeedback(type: 'success' | 'error') {
  try {
    // 1. Vibração (se o dispositivo suportar)
    if (navigator.vibrate) {
      if (type === 'success') {
        navigator.vibrate(50); // Vibração curta
      } else {
        navigator.vibrate([200, 100, 200]); // Vibração dupla (Alerta)
      }
    }

    // 2. Som Sintético (Bipe estilo leitor de supermercado)
    // Usamos AudioContext nativo, sem precisar de arquivos .mp3
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime); // Som agudo/suave
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Volume baixo
      osc.start();
      osc.stop(ctx.currentTime + 0.1); // Bipe rápido (100ms)
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime); // Som grave/alerta
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.3); // Bipe mais longo (300ms)
    }
  } catch (e) {
    console.error("Erro ao reproduzir feedback sensorial", e);
  }
}