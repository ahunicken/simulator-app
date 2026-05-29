import React from 'react';
import {
  BookOpen, CheckCircle, XCircle, FileText, HelpCircle,
  Sparkles, Play, Award, Trash2
} from 'lucide-react';
import { Question, Settings, QuestionContext } from '../constants';

interface SetupScreenProps {
  rawText: string;
  setRawText: (t: string) => void;
  parsedQuestions: Question[];
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  context: QuestionContext;
  setContext: (c: QuestionContext) => void;
  onParseQuestions: () => void;
  onLoadTrial: () => void;
  onClearEditor: () => void;
  onStartExam: () => void;
}

export default function SetupScreen({
  rawText, setRawText, parsedQuestions, settings, setSettings,
  context, setContext,
  onParseQuestions, onLoadTrial, onClearEditor, onStartExam
}: SetupScreenProps) {

  const placeholderContext1 = `Escribe o pega tus preguntas con el formato:\n\nQuestion 1\n\nTitle: Tema de la pregunta (opcional)\n\n¿Tu pregunta aquí?\n\na.Opción A\nb.Opción B\nCorrect: Tu explicación aquí (b es la correcta por estar ARRIBA del Correct:)\nc. Opción C\nd.Opción D\n\n¡Luego haz clic en "Interpretar y Cargar Preguntas" abajo para ver el preview e iniciar!`;

  const placeholderContext2 = `Escribe o pega tus preguntas con el formato:\n\nQuestion 1 of 25\n\n¿Tu pregunta aquí?\n\nSelect an answer:\n\nOpción A\nOpción B (The correct answer)\nOpción C\nOpción D\n\nRegla: Marca la opción correcta agregando (The correct answer) al final de la línea.\n¡Luego haz clic en "Interpretar y Cargar Preguntas" abajo para ver el preview e iniciar!`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRawText(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">

          {/* Selector de contexto */}
          <div className="flex items-center gap-2 px-4 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Formato:</span>
            {([1, 2] as QuestionContext[]).map(c => (
              <button key={c} onClick={() => setContext(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  context === c
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                Contexto {c}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h3 className="font-semibold text-white text-base">Escribe o pega tus preguntas</h3>
                <p className="text-xs text-slate-400">El editor se encuentra limpio para que agregues tu propio contenido.</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={onClearEditor}
                  className="text-xs bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-medium py-1.5 px-3 rounded-lg transition flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Limpiar Editor
                </button>
                <label className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 cursor-pointer">
                  <FileText className="h-3.5 w-3.5" /> Cargar .txt
                  <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={context === 1 ? placeholderContext1 : placeholderContext2}
              className="w-full h-80 bg-slate-900 text-slate-200 font-mono text-sm p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y transition duration-200 placeholder-slate-600"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-between items-stretch sm:items-center">
              <button
                onClick={onLoadTrial}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 hover:text-indigo-200 font-semibold py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Cargar Versión de Prueba (Ejemplo)
              </button>
              <button
                onClick={onParseQuestions}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" /> Interpretar y Cargar Preguntas
              </button>
            </div>

            {/* Guía de formato */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-sm">
                <HelpCircle className="h-4 w-4 text-indigo-400" /> Guía del formato — Contexto {context}:
              </div>
              {context === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 leading-relaxed font-mono">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <p className="text-indigo-300 text-[10px] mb-1 font-semibold uppercase font-sans">Estructura esperada</p>
                    Question 1<br />
                    Title: Tema opcional<br /><br />
                    ¿Pregunta o enunciado?<br /><br />
                    a.Primera opción<br />
                    b.Segunda opción<br />
                    Correct: Explicación de la correcta<br />
                    <span className="text-emerald-400/90 text-[10px] font-sans">^ (La opción correcta es la 'b' por estar arriba)</span><br />
                    c. Tercera opción<br />
                    d.Cuarta opción
                  </div>
                  <div className="space-y-1.5 font-sans flex flex-col justify-center text-[11px]">
                    <p>✓ Comienza cada bloque con <span className="text-indigo-300 font-mono font-semibold">Question X</span>.</p>
                    <p>✓ Agrega <span className="text-indigo-300 font-mono font-semibold">Title: Tema</span> para identificar el tema (opcional).</p>
                    <p>✓ Las opciones comienzan con <span className="text-indigo-300 font-mono font-semibold">a.</span>, <span className="text-indigo-300 font-mono font-semibold">b.</span>, <span className="text-indigo-300 font-mono font-semibold">c.</span>, <span className="text-indigo-300 font-mono font-semibold">d.</span>.</p>
                    <p>✓ <strong className="text-emerald-300">Regla de Posición:</strong> Coloca <span className="text-indigo-300 font-mono font-semibold">Correct: Explicación</span> inmediatamente debajo de la opción correcta.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 leading-relaxed font-mono">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <p className="text-indigo-300 text-[10px] mb-1 font-semibold uppercase font-sans">Estructura esperada</p>
                    Question 1 of 25<br /><br />
                    ¿Pregunta o enunciado?<br /><br />
                    Select an answer:<br /><br />
                    Primera opción<br />
                    Segunda opción (The correct answer)<br />
                    <span className="text-emerald-400/90 text-[10px] font-sans">^ marcada con (The correct answer)</span><br />
                    Tercera opción<br />
                    Cuarta opción
                  </div>
                  <div className="space-y-1.5 font-sans flex flex-col justify-center text-[11px]">
                    <p>✓ Comienza cada bloque con <span className="text-indigo-300 font-mono font-semibold">Question X of Y</span>.</p>
                    <p>✓ El enunciado va debajo del título.</p>
                    <p>✓ Incluye la línea <span className="text-indigo-300 font-mono font-semibold">Select an answer:</span> antes de las opciones.</p>
                    <p>✓ Las opciones son líneas simples de texto, sin prefijo de letra.</p>
                    <p>✓ Marca la correcta agregando <span className="text-indigo-300 font-mono font-semibold">(The correct answer)</span> al final de la opción.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview de preguntas */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" /> Preguntas Interpretadas ({parsedQuestions.length})
              </h3>
              <p className="text-xs text-slate-400">Vista previa estructural. Muestra solo la primera pregunta para no spoilear las respuestas correctas.</p>
            </div>
          </div>

          {parsedQuestions.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-slate-600" />
              <div>
                <p className="font-semibold text-slate-300">Ninguna pregunta cargada aún</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Escribe tus preguntas en el editor (o carga la versión de prueba) y haz clic en el botón <strong className="text-indigo-400">"Interpretar y Cargar Preguntas"</strong> para generar este preview.
                </p>
              </div>
            </div>
          ) : (() => {
            const q = parsedQuestions[0];
            return (
              <div className="space-y-3">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 bg-indigo-600/10 text-indigo-300 text-[10px] px-2 py-0.5 rounded-bl border-b border-l border-indigo-800/30 font-semibold uppercase">Vista previa de formato</div>
                  {q.topic && (
                    <div className="mb-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg inline-block">{q.topic}</div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{q.title || `Pregunta ${q.id}`}</span>
                      <h4 className="font-semibold text-sm text-white mt-1.5">{q.subject}</h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 shrink-0 font-mono mt-1">
                      Correcta: {q.correctKey.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/60 text-xs text-slate-400">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className={`flex items-center gap-2 px-2 py-1 rounded ${opt.key === q.correctKey ? 'text-emerald-300 font-medium bg-emerald-500/5' : ''}`}>
                        <span className={`font-mono text-[10px] w-4 h-4 flex items-center justify-center rounded-full ${opt.key === q.correctKey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'}`}>{opt.key}</span>
                        <span className="truncate">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                  {q.hint && (
                    <div className="mt-2.5 text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 flex items-start gap-1.5">
                      <span className="font-semibold text-indigo-400 shrink-0 font-sans">Explicación:</span>
                      <span>{q.hint}</span>
                    </div>
                  )}
                </div>
                {parsedQuestions.length > 1 && (
                  <div className="text-center p-3 bg-slate-900/20 border border-slate-800/50 rounded-xl text-xs text-slate-500">
                    * Ocultando las <strong className="text-slate-400">{parsedQuestions.length - 1}</strong> preguntas restantes en el preview para proteger tu simulación y no revelar respuestas anticipadamente.
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Columna Derecha: Panel de configuración */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
          <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" /> Simulador de Certificación
          </h3>

          <div className="my-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Preguntas Listas:</span>
              <span className="font-semibold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700 font-mono">{parsedQuestions.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Estado:</span>
              {parsedQuestions.length > 0 ? (
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="h-3 w-3" /> Listas para jugar
                </span>
              ) : (
                <span className="text-rose-400 text-xs font-semibold flex items-center gap-1 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  <XCircle className="h-3 w-3" /> Sin cargar
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Parámetros de Examen</h4>

            {[
              { key: 'instantFeedback', label: 'Modo de práctica', desc: 'Ver respuesta correcta tras cada selección' },
              { key: 'shuffle', label: 'Mezclar preguntas', desc: 'Desordena el orden de aparición' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition border border-slate-800 cursor-pointer group">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">{label}</span>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <input type="checkbox" checked={settings[key as keyof Settings] as boolean}
                  onChange={(e) => setSettings(p => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>
            ))}

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-white">Examen con tiempo límite</span>
                  <p className="text-xs text-slate-400">Simula el examen real de certificación</p>
                </div>
                <input type="checkbox" checked={settings.useTimer}
                  onChange={(e) => setSettings(p => ({ ...p, useTimer: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>
              {settings.useTimer && (
                <div className="flex items-center gap-3 pt-2.5 border-t border-slate-800/80">
                  <span className="text-xs text-slate-400">Duración:</span>
                  <input type="number" min="1" max="180" value={settings.timerDuration}
                    onChange={(e) => setSettings(p => ({ ...p, timerDuration: parseInt(e.target.value) || 15 }))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center text-indigo-300 font-mono font-semibold"
                  />
                  <span className="text-xs text-slate-400">Minutos</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button onClick={onStartExam} disabled={parsedQuestions.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99]"
            >
              <Award className="h-5 w-5" /> Comenzar Examen de Prueba
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2.5">
              Calificación para aprobar: <span className="font-semibold text-emerald-400">70%</span> de respuestas correctas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
