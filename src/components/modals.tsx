import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExitModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

interface SubmitModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitConfirmModal({ onCancel, onConfirm }: ExitModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-rose-400">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <h3 className="text-base font-bold text-white">¿Abandonar Examen?</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Si sales ahora, perderás todo el progreso y las respuestas seleccionadas de esta simulación.
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onCancel} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2 px-4 rounded-xl transition">
            Cancelar
          </button>
          <button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition">
            Abandonar
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubmitConfirmModal({ onCancel, onConfirm }: SubmitModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <h3 className="text-base font-bold text-white">¿Enviar Examen Incompleto?</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Aún te quedan preguntas sin responder. Las preguntas sin contestar se calificarán como incorrectas. ¿Deseas finalizar de todos modos?
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onCancel} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2 px-4 rounded-xl transition">
            Seguir respondiendo
          </button>
          <button onClick={onConfirm} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition shadow-lg shadow-emerald-600/15">
            Enviar Respuestas
          </button>
        </div>
      </div>
    </div>
  );
}
