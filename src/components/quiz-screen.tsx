import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Bookmark, HelpCircle } from 'lucide-react';
import { Question, Settings } from '../constants';

interface QuizScreenProps {
  quizQuestions: Question[];
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  settings: Settings;
  onSelectOption: (key: string) => void;
  onToggleFlag: (id: number) => void;
  onSubmit: () => void;
  onExitRequest: () => void;
}

export default function QuizScreen({
  quizQuestions, currentIdx, setCurrentIdx, answers, flagged,
  settings, onSelectOption, onToggleFlag, onSubmit, onExitRequest
}: QuizScreenProps) {
  const q = quizQuestions[currentIdx];
  const userAnswer = answers[q.id];
  const hasAnswered = userAnswer !== undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Pregunta actual */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 md:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/10 text-indigo-300 text-xs px-2.5 py-1 rounded-lg border border-indigo-500/20 font-mono font-semibold">
                {q.title || `Pregunta ${currentIdx + 1}`}
              </span>
              {flagged[q.id] && (
                <span className="bg-amber-500/10 text-amber-300 text-xs px-2 py-0.5 rounded-lg border border-amber-500/20 flex items-center gap-1 font-semibold animate-pulse">
                  <Bookmark className="h-3.5 w-3.5 fill-current" /> Marcada
                </span>
              )}
            </div>
            <button
              onClick={() => onToggleFlag(q.id)}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${flagged[q.id] ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              <Bookmark className={`h-4 w-4 ${flagged[q.id] ? 'fill-current' : ''}`} />
              <span>{flagged[q.id] ? 'Marcada' : 'Marcar para repasar'}</span>
            </button>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-6">{q.subject}</h2>

          <div className="space-y-3">
            {q.options.map((opt, oIdx) => {
              const isSelected = userAnswer === opt.key;
              const isCorrect = opt.key === q.correctKey;

              let optBg = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700';
              let badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';

              if (settings.instantFeedback && hasAnswered) {
                if (isCorrect) {
                  optBg = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  badgeClass = 'bg-emerald-500 text-emerald-950 border-emerald-400 font-bold';
                } else if (isSelected) {
                  optBg = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  badgeClass = 'bg-rose-500 text-rose-950 border-rose-400 font-bold';
                } else {
                  optBg = 'bg-slate-900/40 border-slate-800/60 text-slate-500';
                }
              } else if (isSelected) {
                optBg = settings.instantFeedback
                  ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200'
                  : 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20';
                badgeClass = settings.instantFeedback
                  ? 'bg-indigo-500 text-white border-indigo-400'
                  : 'bg-indigo-600 text-white border-indigo-400';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => onSelectOption(opt.key)}
                  disabled={settings.instantFeedback && hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-150 ${optBg}`}
                >
                  <span className={`font-mono text-sm w-7 h-7 shrink-0 flex items-center justify-center rounded-lg border uppercase transition duration-150 ${badgeClass}`}>{opt.key}</span>
                  <span className="text-sm md:text-base">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {settings.instantFeedback && hasAnswered && q.hint && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-indigo-500/20 text-xs space-y-1">
              <div className="font-semibold text-indigo-300 flex items-center gap-1.5 text-sm">
                <HelpCircle className="h-4 w-4" /> Explicación:
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{q.hint}</p>
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <button
            onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-40 py-2.5 px-4 rounded-xl transition"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </button>
          {currentIdx < quizQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(p => Math.min(quizQuestions.length - 1, p + 1))}
              className="flex items-center gap-1.5 text-xs md:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 rounded-xl transition"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="flex items-center gap-1.5 text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-5 rounded-xl transition"
            >
              <CheckCircle className="h-4 w-4" /> Terminar Examen
            </button>
          )}
        </div>
      </div>

      {/* Panel lateral: índice */}
      <div className="lg:col-span-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400">Índice del Examen</h3>
            <span className="text-xs text-slate-400 font-semibold font-mono">{Object.keys(answers).length}/{quizQuestions.length} Resueltas</span>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2.5">
            {quizQuestions.map((question, idx) => {
              const isAnswered = answers[question.id] !== undefined;
              const isFlagged = flagged[question.id];
              const isCurrent = idx === currentIdx;

              const isWrong = isAnswered && answers[question.id] !== question.correctKey;
              let btnClass = 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800';
              if (isCurrent) btnClass = 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-500/30';
              else if (isFlagged) btnClass = 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-semibold';
              else if (isWrong) btnClass = 'bg-rose-950/60 border-rose-500/60 text-rose-300 font-semibold';
              else if (isAnswered) btnClass = 'bg-slate-800 border-indigo-500/50 text-indigo-300 font-medium';

              return (
                <button key={idx} onClick={() => setCurrentIdx(idx)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold border transition duration-150 relative ${btnClass}`}
                >
                  <span>{idx + 1}</span>
                  {isAnswered && !isCurrent && !isFlagged && <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full absolute bottom-1"></span>}
                  {isFlagged && !isCurrent && <Bookmark className="h-2 w-2 text-amber-400 fill-current absolute top-0.5 right-0.5" />}
                  {isWrong && !isFlagged && !isCurrent && <span className="w-1.5 h-1.5 bg-rose-400 rounded-full absolute bottom-1"></span>}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-slate-800 border border-indigo-500/50 block"></span><span>Respondida</span></div>
            <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800 block"></span><span>Sin Responder</span></div>
            <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-amber-950/60 border border-amber-500/60 block"></span><span>Marcada (Duda)</span></div>
            <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-rose-950/60 border border-rose-500/60 block"></span><span>Incorrecta</span></div>
            <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-400 block"></span><span>Actual</span></div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button onClick={onExitRequest}
              className="w-full text-center text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/10 hover:bg-rose-900/20 border border-rose-900/30 py-2.5 rounded-xl transition"
            >
              Abandonar Examen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
