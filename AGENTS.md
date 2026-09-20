# Project implementation rules

- Read PLAN.md and tasks.md before changing scope. Work in the current phase and keep the app runnable.
- Preserve the approved stack: Next.js App Router, strict TypeScript, Tailwind, shadcn/Radix, Lucide, Motion, dnd-kit, Zustand, React Hook Form, and Zod.
- Keep domain data, state, pure calculations, and UI separated. Reserve components/ui for reusable primitives.
- Use shared semantic tokens and Lucide icons. Support keyboard/tap alternatives and reduced motion.
- Keep the first release frontend-only; no backend, authentication, map API, live prices, or AI service.
- Run relevant tests, lint, and a production build before marking a phase complete. Report checks accurately.
- Update tasks.md and summarize the phase for review before broad changes to the next phase, as required by PLAN.md.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
