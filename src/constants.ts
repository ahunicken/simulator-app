export const TRIAL_QUESTIONS_TEXT = `Question 1

¿Cuál es el planeta más grande de nuestro sistema solar?

a.Marte
b.Tierra
c. Júpiter
Correct: Júpiter es el planeta con mayor masa y tamaño del sistema solar.
d.Saturno

Question 2

¿Qué lenguaje de programación es ampliamente utilizado para agregar interactividad en las páginas web?

a.HTML
b.CSS
c. JavaScript
Correct: I don't have a comment.
d.SQL

Question 3

¿Cuál es el resultado de la operación matemática 8 multiplicado por 7?

a.54
b.56
Correct: 8 x 7 es igual a 56.
c. 62
d.48`;

export const TRIAL_QUESTIONS_TEXT_2 = `Question 1 of 3

You work for a credit card company that's training a data model to better understand which customers should get promotions. At a meeting, one of the directors says that they're glad you're working in a data model because then they can use it to help them detect credit card fraud. How might you respond?

Select an answer:

You tell them that since the predictive data model won't need to be retrained, you can use it for all other company's needs.
If you want the system to detect credit card fraud it would have to be retrained for that purpose. (The correct answer)
The system will only be able to detect fraud once it achieves a 99.9% accuracy at predicting promotions.
You should use the generative AI model that requires less data but also has less flexibility.

Question 2 of 3

What is the primary purpose of a confusion matrix in machine learning?

Select an answer:

To visualize the distribution of training data.
To evaluate the performance of a classification model. (The correct answer)
To optimize hyperparameters during training.
To reduce the dimensionality of input features.

Question 3 of 3

Which of the following best describes supervised learning?

Select an answer:

The model learns patterns from unlabeled data.
The model is trained using labeled input-output pairs. (The correct answer)
The model improves through trial and error with rewards.
The model clusters data into groups without guidance.`;

export type QuestionContext = 1 | 2;

export type Screen = 'setup' | 'quiz' | 'results';
export type ResultsFilter = 'all' | 'correct' | 'incorrect' | 'flagged';
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Option {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  title: string;
  topic: string;
  subject: string;
  options: Option[];
  correctKey: string;
  hint: string;
}

export interface Settings {
  instantFeedback: boolean;
  shuffle: boolean;
  useTimer: boolean;
  timerDuration: number;
}

export interface QuizResults {
  score: number;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  timeSpentFormatted: string;
}

export interface Notification {
  message: string;
  type: NotificationType;
}
