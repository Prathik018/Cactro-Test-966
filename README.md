# Mobile Stories — React + Vite + Tailwind (Mobile-first)

A lightweight, mobile-first Instagram Stories clone built with React (Vite) and Tailwind CSS. The app demonstrates grouping stories by user, per-story progress, autoplay with a custom timer hook, tap-to-navigate regions, long-press pause, and simple loading states — all implemented using React functional components and hooks with no external carousel/story libraries.

This repository is intended for mobile-first UI demos and learning how to build story-style experiences with plain React.

**Live / Dev**

- Start dev server:

```bash
npm install
npm run dev
```

- Build for production:

```bash
npm run build
npm run preview
```

Requirements
- Node.js (16+ recommended)

Tech
- React (functional components + hooks)
- Vite
- Tailwind CSS

Overview
- The UI is optimized for small screens and uses the following key components:
  - `src/components/StoryList.jsx` — horizontally scrollable user previews
  - `src/components/StoryItem.jsx` — circular avatar preview for each user
  - `src/components/StoryViewer.jsx` — full-screen viewer with progress bars, tap zones, and close control
  - `src/components/ProgressBar.jsx` — per-story progress segment
  - `src/hooks/useStoryTimer.js` — custom timer hook powering autoplay and progress

Data format
- Stories are grouped by user. The file `src/data/stories.json` contains the mock data. Each user object uses this shape:

```json
{
  "id": 1,
  "username": "alex",
  "profileImage": "https://...",
  "stories": [
    { "id": "1-1", "image": "https://..." },
    { "id": "1-2", "image": "https://..." }
  ]
}
```

- The app expects an array of such user objects. You can add multiple story objects per user to show multiple stories for a single person.

How it works
- Opening a user preview starts the viewer at that user's first story.
- Autoplay advances each story after 5s (configurable in `useStoryTimer`).
- Long-press pauses autoplay; release resumes.
- Tap left/right halves to navigate prev/next — the viewer first moves through the current user's stories, then advances to the next user when the user’s stories are exhausted. If on the final story of the final user, the viewer closes.
