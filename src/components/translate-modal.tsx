import { Languages, Loader2 } from 'lucide-react';

interface TranslateModalProps {
  label: string;
  provider: string;
  model: string;
  isLoading: boolean;
  error: string | null;
  translation: string | undefined;
  onClose: () => void;
}

export default function TranslateModal({ label, provider, model, isLoading, error, translation, onClose }: TranslateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-slate-900 border border-violet-500/30 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-violet-400" />
            <h3 className="font-bold text-white text-base">Traducción al Español</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <div className="text-xs text-slate-500 font-mono">{label} — {provider} / {model}</div>
        <div className="min-h-[120px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              <span className="text-sm">Traduciendo...</span>
            </div>
          ) : error ? (
            <div className="w-full px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm">{error}</div>
          ) : (
            <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-line w-full">{translation}</p>
          )}
        </div>
        <button onClick={onClose} className="w-full bg-violet-700 hover:bg-violet-600 text-white font-semibold py-2.5 rounded-xl transition text-sm">
          Cerrar
        </button>
      </div>
    </div>
  );
}
