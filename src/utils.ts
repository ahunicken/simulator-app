import { Question } from './constants';

export const isNoComment = (text: string): boolean => {
  if (!text) return true;
  const clean = text.trim().toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, '');
  const noCommentPhrases = [
    'i dont have a comment', 'dont have a comment', 'no comment',
    'no tengo comentario', 'no tengo explicacion', 'sin comentario',
    'sin explicacion', 'none', 'nada', 'no'
  ];
  return noCommentPhrases.some(p => clean === p) || clean === '';
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const parseTextToQuestions = (text: string): Question[] => {
  const cleanText = text.replace(/\r\n/g, '\n').trim();
  if (!cleanText) return [];

  const blocks: string[] = [];
  const questionRegex = /(?:^|\n)(?=Question\s+\d+)/i;

  if (questionRegex.test(cleanText)) {
    cleanText.split(questionRegex).forEach(b => { if (b.trim()) blocks.push(b.trim()); });
  } else {
    cleanText.split(/\n\s*\n/).forEach(b => { if (b.trim()) blocks.push(b.trim()); });
  }

  const result: Question[] = [];

  blocks.forEach((block, idx) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return;

    let title = `Pregunta ${idx + 1}`;
    let linePointer = 0;

    if (/^Question\s+\d+/i.test(lines[0])) {
      title = lines[0];
      linePointer = 1;
    }

    const subjectLines: string[] = [];
    while (linePointer < lines.length) {
      const line = lines[linePointer];
      if (/^[a-e]\s*[.\)]/i.test(line) || /^Correct(?:a)?\s*:/i.test(line)) break;
      subjectLines.push(line);
      linePointer++;
    }
    const subject = subjectLines.join(' ');

    const options: { key: string; text: string }[] = [];
    let correctKey = '';
    let hint = '';
    let lastOptionKey = '';

    while (linePointer < lines.length) {
      const line = lines[linePointer];
      const optionMatch = line.match(/^([a-e])\s*[.\)]\s*(.*)/i);
      const correctMatch = line.match(/^Correct(?:a)?\s*:\s*(.*)/i);

      if (optionMatch) {
        const key = optionMatch[1].toLowerCase();
        options.push({ key, text: optionMatch[2].trim() });
        lastOptionKey = key;
      } else if (correctMatch) {
        const rawContent = correctMatch[1].trim();
        correctKey = lastOptionKey || 'a';
        const isSingleLetter = /^[a-e]$/i.test(rawContent);
        hint = isSingleLetter ? '' : rawContent;
      }
      linePointer++;
    }

    const cleanedHint = hint.replace(/^(hint|pista)\s*(?:-\s*|:\s*|\s+)/i, '').trim();
    const finalHint = isNoComment(cleanedHint) ? '' : cleanedHint;

    if (subject && options.length > 0) {
      result.push({ id: idx + 1, title, subject, options, correctKey: correctKey || 'a', hint: finalHint });
    }
  });

  return result;
};

export const parseTextToQuestionsContext2 = (text: string): Question[] => {
  const cleanText = text.replace(/\r\n/g, '\n').trim();
  if (!cleanText) return [];

  const blocks: string[] = [];
  cleanText.split(/(?:^|\n)(?=Question\s+\d+\s+of\s+\d+)/i).forEach(b => {
    if (b.trim()) blocks.push(b.trim());
  });

  const result: Question[] = [];
  const keys = ['a', 'b', 'c', 'd', 'e'];

  blocks.forEach((block, idx) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return;

    let title = `Question ${idx + 1}`;
    let linePointer = 0;

    if (/^Question\s+\d+\s+of\s+\d+/i.test(lines[0])) {
      title = lines[0];
      linePointer = 1;
    }

    const subjectLines: string[] = [];
    while (linePointer < lines.length) {
      const line = lines[linePointer];
      if (/^Select an answer/i.test(line)) { linePointer++; break; }
      subjectLines.push(line);
      linePointer++;
    }
    const subject = subjectLines.join(' ');

    const options: { key: string; text: string }[] = [];
    let correctKey = 'a';

    while (linePointer < lines.length) {
      const line = lines[linePointer];
      const isCorrect = /\(the correct answer\)/i.test(line);
      const text = line.replace(/\s*\(the correct answer\)\s*/i, '').trim();
      const key = keys[options.length];
      options.push({ key, text });
      if (isCorrect) correctKey = key;
      linePointer++;
    }

    if (subject && options.length > 0) {
      result.push({ id: idx + 1, title, subject, options, correctKey, hint: '' });
    }
  });

  return result;
};
