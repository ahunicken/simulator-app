import React from 'react';
import { CheckCircle, XCircle, RotateCcw, Edit, ArrowLeft, Bookmark, Check, Info } from 'lucide-react';
import { Question, QuizResults, ResultsFilter } from '../constants';

interface ResultsScreenProps {
  quizResults: QuizResults;
  quizQuestions: Question[];
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  resultsFilter: ResultsFilter;
  setResultsFilter: (f: ResultsFilter) => void;
  onRetry: () => void;
  onRetryIncorrect: () => void;
  onEdit: () => void;
}

export default function ResultsScreen({
  quizResults, quizQuestions, answers, flagged,
  resultsFilter, setResultsFilter, onRetry, onRetryIncorrect, onEdit
}: ResultsScreenProps) {
  const filteredQuestions = quizQuestions.filter(q => {
    const isCorrect = answers[q.id] === q.correctKey;
    if (resultsFilter === 'correct') return isCorrect;
    if (resultsFilter === 'incorrect') return !isCorrect;
    if (resultsFilter === 'flagged') return flagged[q.id];
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tarjeta de resultado */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Círculo de puntuación */}
          <div className="relative shrink-0 flex flex-col items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="60" className="stroke-slate-800" strokeWidth="12" fill="transparent" />
              <circle
                cx="72" cy="72" r="60"
                className={`transition-all duration-1000 ${quizResults.passed ? 'stroke-emerald-500' : 'stroke-rose-500'}`}
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - quizResults.score / 100)}`}
                strokeLinecap="round" fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-white">{quizResults.score}%</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Puntuación</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow space-y-4 text-center md:text-left">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${quizResults.passed ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300' : 'bg-rose-950/50 border-rose-500 text-rose-300'}`}>
                {quizResults.passed ? <><CheckCircle className="h-4 w-4" /> ¡Examen Aprobado!</> : <><XCircle className="h-4 w-4" /> No Alcanzaste el 70%</>}
              </span>
              <h2 className="text-2xl font-bold text-white mt-3 leading-tight">
                {quizResults.passed ? '¡Felicitaciones! Has demostrado tener un excelente conocimiento' : 'Sigue practicando, estás en el camino correcto'}
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                {quizResults.passed ? 'Superaste con éxito el umbral de aprobación del 70%. Estás listo para certificar tus conocimientos.' : 'El puntaje mínimo requerido para pasar es un 70%. Revisa tus errores abajo y vuelve a intentarlo.'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="block text-[10px] text-slate-400 uppercase">Correctas</span>
                <span className="text-base font-extrabold text-emerald-400">{quizResults.correctCount} / {quizResults.totalCount}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center">
                <span className="block text-[10px] text-slate-400 uppercase">Tiempo empleado</span>
                <span className="text-base font-extrabold text-indigo-300">{quizResults.timeSpentFormatted}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-slate-400 uppercase">Resultado</span>
                <span className={`text-base font-extrabold ${quizResults.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quizResults.passed ? 'APROBADO' : 'REPROBADO'}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-5 md:pt-0 md:pl-6">
            <button onClick={onRetry} className="w-full md:w-48 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2">
              <RotateCcw className="h-4 w-4" /> Reintentar Todo
            </button>
            {quizResults.totalCount - quizResults.correctCount > 0 && (
              <button onClick={onRetryIncorrect} className="w-full md:w-48 bg-rose-700 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2">
                <RotateCcw className="h-4 w-4" /> Repasar Incorrectas ({quizResults.totalCount - quizResults.correctCount})
              </button>
            )}
            <button onClick={onEdit} className="w-full md:w-48 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2">
              <Edit className="h-4 w-4" /> Editar Preguntas
            </button>
          </div>
        </div>
      </div>

      {/* Revisión detallada */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg">Revisión de Preguntas</h3>
            <p className="text-xs text-slate-400">Analiza cada respuesta para afianzar tus conocimientos</p>
          </div>
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {([
              { key: 'all', label: `Todas (${quizQuestions.length})` },
              { key: 'correct', label: `Correctas (${quizResults.correctCount})` },
              { key: 'incorrect', label: `Incorrectas (${quizResults.totalCount - quizResults.correctCount})` },
              { key: 'flagged', label: `Marcadas (${Object.values(flagged).filter(Boolean).length})` },
            ] as { key: ResultsFilter; label: string }[]).map(({ key, label }) => (
              <button key={key} onClick={() => setResultsFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${resultsFilter === key ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isCorrect = answers[q.id] === q.correctKey;
            const userAnswer = answers[q.id];

            return (
              <div key={idx} className={`border rounded-2xl p-5 md:p-6 shadow-md bg-slate-950 ${isCorrect ? 'border-emerald-500/20 bg-gradient-to-br from-slate-950 to-emerald-950/10' : 'border-rose-500/20 bg-gradient-to-br from-slate-950 to-rose-950/10'}`}>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{q.title || `Pregunta ${q.id}`}</span>
                      {flagged[q.id] && (
                        <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 font-bold">
                          <Bookmark className="h-3 w-3 fill-current" /> Marcada
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm md:text-base text-white mt-1 leading-relaxed">{q.subject}</h4>
                  </div>
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                        <CheckCircle className="h-4 w-4" /> Correcta
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                        <XCircle className="h-4 w-4" /> Incorrecta
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswer === opt.key;
                    const isCorrectOpt = opt.key === q.correctKey;
                    let optStyle = 'bg-slate-900/60 border-slate-800 text-slate-400';
                    let icon = null;
                    if (isCorrectOpt) {
                      optStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium';
                      icon = <Check className="h-4 w-4 text-emerald-400 shrink-0" />;
                    } else if (isSelected) {
                      optStyle = 'bg-rose-950/40 border-rose-500/50 text-rose-300 font-medium';
                      icon = <XCircle className="h-4 w-4 text-rose-400 shrink-0" />;
                    }
                    return (
                      <div key={oIdx} className={`p-3 rounded-xl border text-xs md:text-sm flex items-center justify-between gap-3 ${optStyle}`}>
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded uppercase font-semibold border ${isCorrectOpt ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : isSelected ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-500'}`}>{opt.key}</span>
                          <span>{opt.text}</span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {q.hint && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-indigo-400" /> Explicación:
                    </div>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{q.hint}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button onClick={onEdit} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver a la pantalla de configuración
        </button>
      </div>
    </div>
  );
}
