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
  const hintText = q.hint
    ? (q.hint.startsWith('Respuesta correcta:') ? q.hint : `Correct answer: ${correctText}\nExplanation: ${q.hint}`)
    : `Correct answer: ${correctText}`;

  const prompt = `Translate the following exam question to Spanish. Return ONLY valid JSON with this exact structure, no extra text:
{
  "subject": "<translated question>",
  "options": { ${q.options.map(o => `"${o.key}": "<translated option ${o.key}>"`).join(', ')} },
  "hint": "<translated hint WITH generated explanation>"
}

Question: ${q.subject}
Options:
${optionsText}
Hint: ${hintText}

IMPORTANT: For the 'hint' field, translate the provided hint. If the hint ONLY states the correct answer and lacks an explanation, you MUST generate a brief, clear explanation in Spanish of WHY that answer is correct and include it.`;

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

export async function translateText(text: string, model: string): Promise<string> {
  const client = getClient();
  const res = await client.chat.completions.create({
    model,
    max_completion_tokens: 1500,
    messages: [
      { role: 'system', content: 'You are a translator expert in questions of AI.' },
      { role: 'user', content: `Translate the following text to Spanish.\n\nIMPORTANT: If the text only states which answer is correct but lacks an explanation, please generate a brief and clear explanation of WHY that answer is correct in Spanish and append it.\n\nReturn ONLY the final translated text, nothing else.\n\nText:\n${text}` },
    ],
  });
  return res.choices[0].message.content?.trim() ?? '';
}
