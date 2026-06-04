import OpenAI from 'openai';
import { Question } from './constants';

export async function translateQuestion(q: Question, model: string): Promise<string> {
  const optionsText = q.options.map(o => `${o.key}. ${o.text}`).join('\n');
  const prompt = `Translate the following exam question and its options to Spanish. Return ONLY the translated text in this exact format:
QUESTION: <translated question>
OPTIONS:
<translated options, one per line keeping the letter prefix>

Question: ${q.subject}
Options:
${optionsText}`;

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY no está definida en el archivo .env');
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a translator expert in questions of AI.' },
      { role: 'user', content: prompt },
    ],
  });
  return res.choices[0].message.content?.trim() ?? '';
}
