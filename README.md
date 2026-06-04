# Simulador de Certificación v2.5

An interactive exam simulator built with React + TypeScript + Tailwind CSS. Load your own question sets, practice with instant feedback, and track your performance — all in the browser.

---

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Environment Variables

Create a `.env` file in the project root:

```
VITE_OPENAI_API_KEY=your_openai_api_key
```

---

## Features

### Question Input
- **Text Editor** — Paste or type questions directly in the editor
- **Load from .txt file** — Upload a `.txt` file from your local machine; its content is loaded into the editor automatically
- **Trial Version** — Load a built-in example set to explore the app without any setup
- **Clear Editor** — Wipe the editor and reset the loaded questions

### Question Formats (Contexts)

The app supports two question formats, selectable via **Contexto 1** / **Contexto 2** buttons.

#### Contexto 1 — Position Rule Format
Options are prefixed with letters (`a.`, `b.`, `c.`, `d.`). The correct answer is determined by the position of the `Correct:` line — whichever option is **immediately above** it is marked as correct.

```
Question 1

What is the largest planet in our solar system?

a. Mars
b. Earth
c. Jupiter
Correct: Jupiter is the largest planet by mass and size.
d. Saturn
```

> In this example, `c` is correct because `Correct:` is placed right below it.

#### Contexto 2 — "The correct answer" Format
Options are plain text lines (no letter prefix). The correct option is marked by appending `(The correct answer)` at the end of the line. The correct answer text is automatically shown in the explanation box after answering.

```
Question 1 of 25

What distinguishes agentic AI from other forms of AI?

Select an answer:

Its focus on structured data processing and analysis.
Its ability to operate autonomously and make independent decisions. (The correct answer)
Its reliance on human prompts and guidance to perform tasks.
Its exclusive use in entertainment and content generation.
```

### Translation
- **Translate button** — Translates the current question and its options to Spanish using OpenAI
- Provider is fixed to **OpenAI**; model is selectable (`gpt-4o-mini` by default, `gpt-5-nano` and `gpt-4-nano` also available)
- Requires `VITE_OPENAI_API_KEY` set in `.env`
- Translations are cached per question during the session

### Exam Settings
| Setting | Description |
|---|---|
| **Practice Mode** | Shows the correct answer immediately after each selection (on by default) |
| **Shuffle Questions** | Randomizes the order of questions each time |
| **Time Limit** | Enables a countdown timer; configurable in minutes |

### Quiz Screen
- Navigate between questions with **Previous / Next** buttons
- **Question Index Panel** — Visual grid showing the status of every question:
  - 🟦 Current question
  - ⬜ Unanswered
  - 🟫 Answered correctly
  - 🔴 Answered incorrectly
  - 🟡 Manually flagged for review
- **Flag for Review** — Mark any question with a bookmark to revisit it later
- **Explanation** — Shown after answering; in Contexto 2 this always displays the correct answer text
- **Abandon Exam** — Exit with a confirmation modal
- **Submit with unanswered questions** — Prompts a confirmation before submitting

### Results Screen
- Score displayed as a circular progress indicator
- Pass/Fail status (passing threshold: **70%**)
- Stats: correct count, time spent, result
- **Retry All** — Restart the full quiz from scratch
- **Retry Incorrect** — Start a new quiz with only the questions you got wrong (button only appears if there are incorrect answers)
- **Detailed Review** — Browse all questions with your answers highlighted:
  - ✅ Correct option shown in green
  - ❌ Your wrong selection shown in red
  - Explanation shown if available
- **Filter** results by: All / Correct / Incorrect / Flagged

---

## Project Structure

```
simulator-app/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── app.tsx                 # Root component — state, logic, routing between screens
    ├── main.tsx                # Entry point
    ├── index.css               # Tailwind directives
    ├── constants.ts            # Types, interfaces, trial question texts, LLM model list
    ├── utils.ts                # Parser functions, formatTime, isNoComment
    ├── translate.ts            # translateQuestion — OpenAI translation logic
    └── components/
        ├── setup-screen.tsx    # Setup page: editor, context selector, settings panel
        ├── quiz-screen.tsx     # Exam page: question display, index panel, navigation
        ├── translate-modal.tsx # Modal for displaying question translations
        ├── results-screen.tsx  # Results page: score, review, retry actions
        ├── notification.tsx    # Floating toast notification
        └── modals.tsx          # Exit confirm & submit confirm modals
```

---

## Tech Stack

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) — icons
- [OpenAI Node SDK](https://github.com/openai/openai-node) — translation
