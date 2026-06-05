import OpenAI from 'openai';
import { Question } from './constants';

function getClient(model: string) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no está definida en el archivo .env');
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export async function translateQuestion(q: Question, model: string): Promise<string> {
  const prompt = `Translate ONLY the question text to Spanish. Return ONLY the translated question, nothing else.

Question: ${q.subject}`;
  const client = getClient(model);
  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a translator expert in questions of AI.' },
      { role: 'user', content: prompt },
    ],
  });
  return res.choices[0].message.content?.trim() ?? '';
}

export async function translateText(text: string, model: string): Promise<string> {
  const client = getClient(model);
  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a translator expert in questions of AI.' },
      { role: 'user', content: `Translate the following text to Spanish. Return ONLY the translated text, nothing else.

${text}` },
    ],
  });
  return res.choices[0].message.content?.trim() ?? '';
}
