import OpenAI from 'openai';
import { Question } from './constants';

export interface FullTranslation {
  subject: string;
  options: Record<string, string>;
  hint: string;
}

function getClient() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no está definida en el archivo .env');
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export async function translateFullQuestion(q: Question, model: string): Promise<FullTranslation> {
  const correctOption = q.options.find(o => o.key === q.correctKey);
  const correctText = correctOption ? correctOption.text : '';
  const optionsText = q.options.map(o => `${o.key}. ${o.text}`).join('\n');
  const hintText = q.hint || "No explanation provided.";

  const prompt = `Translate the following exam question to Spanish. Return ONLY valid JSON with this exact structure, no extra text:
{
  "subject": "<translated question>",
  "options": { ${q.options.map(o => `"${o.key}": "<translated option ${o.key}>"`).join(', ')} },
  "hint": "<translated explanation ONLY, generated if missing>"
}

Question: ${q.subject}
Options:
${optionsText}
Correct Answer to explain: ${correctText}
Original Hint/Explanation: ${hintText}

IMPORTANT: For the 'hint' field, translate the Original Hint. If it lacks a proper explanation, generate a brief, clear explanation in Spanish of WHY the Correct Answer is correct. DO NOT include phrases like "Respuesta correcta:" in the final hint, just provide the explanation text.`;

  const client = getClient();
  const res = await client.chat.completions.create({
    model,
    max_completion_tokens: 2500,
    messages: [
      { role: 'system', content: 'You are a translator expert in exam questions about AI. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ],
  });
  const raw = res.choices[0].message.content?.trim() ?? '{}';
  const cleaned = raw.replace(/^```json\n?|^```\n?|\n?```$/g, '').trim();
  return JSON.parse(cleaned) as FullTranslation;
}

export async function translateText(q: Question, model: string): Promise<string> {
  const correctOption = q.options.find(o => o.key === q.correctKey);
  const correctText = correctOption ? correctOption.text : '';
  const hintText = q.hint || "No explanation provided.";

  const prompt = `You are a translator expert in questions of AI. Translate the following explanation to Spanish.

Correct Answer to explain: ${correctText}
Original Hint/Explanation: ${hintText}

IMPORTANT: If the Original Hint lacks a proper explanation, generate a brief and clear explanation of WHY the Correct Answer is correct in Spanish. 
DO NOT include phrases like "Respuesta correcta:" in your output. Return ONLY the final translated or generated explanation text, nothing else.`;

  const client = getClient();
  const res = await client.chat.completions.create({
    model,
    max_completion_tokens: 1500,
    messages: [
      { role: 'system', content: 'You are a translator expert in questions of AI.' },
      { role: 'user', content: prompt },
    ],
  });
  return res.choices[0].message.content?.trim() ?? '';
}
