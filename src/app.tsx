import React, { useState, useRef, useEffect } from 'react';
import { Award, ArrowLeft, Clock } from 'lucide-react';
import {
  TRIAL_QUESTIONS_TEXT, TRIAL_QUESTIONS_TEXT_2, Screen, ResultsFilter,
  Question, Settings, QuizResults, Notification as NotificationType, QuestionContext
} from './constants';
import { parseTextToQuestions, parseTextToQuestionsContext2, formatTime } from './utils';
import NotificationBanner from './components/notification';
import SetupScreen from './components/setup-screen';
import QuizScreen from './components/quiz-screen';
import ResultsScreen from './components/results-screen';
import { ExitConfirmModal, SubmitConfirmModal } from './components/modals';

export default function App() {
  const [context, setContext] = useState<QuestionContext>(1);
  const [rawText, setRawText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('setup');
  const [settings, setSettings] = useState<Settings>({
    instantFeedback: true, shuffle: false, useTimer: false, timerDuration: 15,
  });

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const [quizResults, setQuizResults] = useState<QuizResults>({
    score: 0, passed: false, correctCount: 0, totalCount: 0, timeSpentFormatted: ''
  });
  const [resultsFilter, setResultsFilter] = useState<ResultsFilter>('all');
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showNotification = (message: string, type: NotificationType['type'] = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            submitQuiz(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  const handleParseQuestions = () => {
    if (!rawText.trim()) {
      showNotification('El editor de texto está vacío. Escribe o carga preguntas primero.', 'warning');
      return;
    }
    const questions = context === 1 ? parseTextToQuestions(rawText) : parseTextToQuestionsContext2(rawText);
    setParsedQuestions(questions);
    if (questions.length > 0) {
      showNotification(`¡Se interpretaron y cargaron ${questions.length} preguntas con éxito!`, 'success');
    } else {
      showNotification('No se identificó ninguna pregunta válida. Verifica el formato.', 'error');
    }
  };

  const handleLoadTrial = () => {
    const trialText = context === 1 ? TRIAL_QUESTIONS_TEXT : TRIAL_QUESTIONS_TEXT_2;
    setRawText(trialText.trim());
    showNotification('Se ha escrito la versión de prueba en el editor. ¡Haz clic en "Cargar Preguntas" para ver su preview!', 'info');
  };

  const handleClearEditor = () => {
    setRawText('');
    setParsedQuestions([]);
    showNotification('Editor limpio y preguntas desvinculadas.', 'info');
  };

  const startExam = () => {
    if (parsedQuestions.length === 0) {
      showNotification('Por favor, primero haz clic en "Cargar Preguntas" para procesar tu set de estudio.', 'error');
      return;
    }
    let questions = JSON.parse(JSON.stringify(parsedQuestions)) as Question[];
    if (settings.shuffle) questions = questions.sort(() => Math.random() - 0.5);
    setQuizQuestions(questions);
    setAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    if (settings.useTimer) {
      setTimeLeft(settings.timerDuration * 60);
      setIsTimerRunning(true);
    } else {
      setTimeLeft(0);
      setIsTimerRunning(false);
    }
    setCurrentScreen('quiz');
    showNotification('¡Examen iniciado! Buena suerte.', 'info');
  };

  const submitQuiz = (force = false) => {
    if (!force && Object.keys(answers).length < quizQuestions.length) {
      setShowSubmitConfirm(true);
      return;
    }
    setShowSubmitConfirm(false);
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    quizQuestions.forEach(q => { if (answers[q.id] === q.correctKey) correctCount++; });
    const totalCount = quizQuestions.length;
    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    let timeSpentFormatted = 'Sin límite';
    if (settings.useTimer) {
      const totalSeconds = (settings.timerDuration * 60) - timeLeft;
      timeSpentFormatted = `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
    }

    setQuizResults({ score, passed: score >= 70, correctCount, totalCount, timeSpentFormatted });
    setCurrentScreen('results');
    setResultsFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased">
      {notification && <NotificationBanner notification={notification} />}

      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Simulador de Certificación <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">v2.5</span>
              </h1>
              <p className="text-xs text-slate-400">Repasa con tu propio set de preguntas estructuradas</p>
            </div>
          </div>

          {currentScreen === 'quiz' && (
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl shadow-inner">
              {settings.useTimer && (
                <div className="flex items-center gap-2 text-amber-400 font-mono text-lg">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
              <div className="text-sm text-slate-400">
                Progreso: <span className="font-semibold text-white">{currentIdx + 1}</span> de <span className="font-semibold text-white">{quizQuestions.length}</span>
              </div>
            </div>
          )}

          {currentScreen === 'results' && (
            <button onClick={() => setCurrentScreen('setup')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition border border-slate-700"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6">
        {currentScreen === 'setup' && (
          <SetupScreen
            rawText={rawText} setRawText={setRawText}
            parsedQuestions={parsedQuestions} settings={settings} setSettings={setSettings}
            context={context} setContext={setContext}
            onParseQuestions={handleParseQuestions} onLoadTrial={handleLoadTrial}
            onClearEditor={handleClearEditor} onStartExam={startExam}
          />
        )}
        {currentScreen === 'quiz' && quizQuestions.length > 0 && (
          <QuizScreen
            quizQuestions={quizQuestions} currentIdx={currentIdx} setCurrentIdx={setCurrentIdx}
            answers={answers} flagged={flagged} settings={settings}
            onSelectOption={(key) => {
              const q = quizQuestions[currentIdx];
              setAnswers(p => ({ ...p, [q.id]: key }));
            }}
            onToggleFlag={(id) => setFlagged(p => ({ ...p, [id]: !p[id] }))}
            onSubmit={() => submitQuiz(false)} onExitRequest={() => setShowExitConfirm(true)}
          />
        )}
        {currentScreen === 'results' && (
          <ResultsScreen
            quizResults={quizResults} quizQuestions={quizQuestions}
            answers={answers} flagged={flagged}
            resultsFilter={resultsFilter} setResultsFilter={setResultsFilter}
            onRetry={startExam}
            onRetryIncorrect={() => {
              const incorrect = quizQuestions.filter(q => answers[q.id] !== q.correctKey);
              if (incorrect.length === 0) return;
              let questions = JSON.parse(JSON.stringify(incorrect)) as Question[];
              if (settings.shuffle) questions = questions.sort(() => Math.random() - 0.5);
              setQuizQuestions(questions);
              setAnswers({});
              setFlagged({});
              setCurrentIdx(0);
              if (settings.useTimer) {
                setTimeLeft(settings.timerDuration * 60);
                setIsTimerRunning(true);
              } else {
                setTimeLeft(0);
                setIsTimerRunning(false);
              }
              setCurrentScreen('quiz');
              showNotification(`Repasando ${incorrect.length} pregunta(s) incorrecta(s). ¡Vamos!`, 'info');
            }}
            onEdit={() => setCurrentScreen('setup')}
          />
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>Preparador de exámenes interactivo - Listo para simulación</p>
          <p className="font-mono text-[11px] text-slate-600">Puntaje mínimo de aprobación: 70%</p>
        </div>
      </footer>

      {showExitConfirm && (
        <ExitConfirmModal onCancel={() => setShowExitConfirm(false)} onConfirm={() => { setShowExitConfirm(false); setCurrentScreen('setup'); }} />
      )}
      {showSubmitConfirm && (
        <SubmitConfirmModal onCancel={() => setShowSubmitConfirm(false)} onConfirm={() => submitQuiz(true)} />
      )}
    </div>
  );
}
