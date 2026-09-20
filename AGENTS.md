# Project implementation rules

- Read PLAN.md and tasks.md before changing scope. Work in the current phase and keep the app runnable.
- Preserve the approved stack: Next.js App Router, strict TypeScript, Tailwind, shadcn/Radix, Lucide, Motion, dnd-kit, Zustand, React Hook Form, and Zod.
- Keep domain data, state, pure calculations, and UI separated. Reserve components/ui for reusable primitives.
- Use shared semantic tokens and Lucide icons. Support keyboard/tap alternatives and reduced motion.
- Keep the first release frontend-only; no backend, authentication, map API, live prices, or AI service.
- Run relevant tests, lint, and a production build before marking a phase complete. Report checks accurately.
- Update tasks.md and summarize the phase for review before broad changes to the next phase, as required by PLAN.md.
