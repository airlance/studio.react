# AGENTS.md — Email Builder Project

This file contains instructions for AI agents working on this codebase.
Read and follow all conventions before making any changes.

---

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **dnd-kit** for drag & drop (`@dnd-kit/core`, `@dnd-kit/sortable`)
- **react-router-dom** v6
- **@tanstack/react-query**
- **lucide-react** (Icons)
- **recharts** (Charts)
- **react-hook-form** + **zod** (Forms & Validation)
- **sonner** (Toasts)
- **vaul** (Drawers)
- **date-fns** (Date utilities)

---

## Project Structure

```
src/
├── components/
│   ├── email-builder/                # Email Builder module
│   │   ├── blocks/                   # One subfolder per block type
│   │   │   └── survey/               # Survey / Rating block
│   │   │       ├── Renderer.tsx      # Canvas preview component
│   │   │       ├── PropsPanel.tsx    # Properties panel component
│   │   │       ├── exportHtml.ts     # HTML export for this block
│   │   │       └── index.ts          # Barrel export
│   │   ├── inline-editor/            # Inline contenteditable editor + toolbar
│   │   ├── canvas/                   # Droppable email canvas helpers
│   │   ├── index-page/               # Index page composition helpers
│   │   ├── properties-panel/         # PropertiesPanel sub-panels and shared controls
│   │   ├── BlockPalette.tsx          # Left panel: draggable block buttons
│   │   ├── BlockRenderer.tsx         # Renders any EmailBlock to JSX
│   │   ├── BuilderHeader.tsx         # Top bar: undo/redo, view toggle, actions
│   │   ├── Canvas.tsx                # Center: droppable email canvas
│   │   ├── PropertiesPanel.tsx       # Right panel: block & template settings
│   │   └── ...                       # Modals and other helpers
│   ├── workflow-builder/             # Workflow Builder module
│   │   ├── nodes/                    # Workflow node components
│   │   ├── modals/                   # Node configuration modals
│   │   ├── constants.ts              # Node types and categories
│   │   ├── types.ts                  # Workflow types
│   │   ├── utils.ts                  # Layout and logic helpers
│   │   └── WorkflowBuilder.tsx       # Main builder component
│   ├── dashboard/                    # Dashboard specific components
│   ├── contacts/                     # Contacts management components
│   ├── campaign-wizard/              # Campaign creation steps
│   ├── fields/                       # Custom fields management
│   ├── layout/                       # App shell, sidebar, navigation
│   └── ui/                           # shadcn/ui shared components
├── config/
│   ├── i18n/
│   │   ├── context.tsx               # TranslationProvider component
│   │   ├── types.ts                  # i18n types
│   │   └── en.ts / ru.ts / ...       # Language dictionaries
│   ├── personalization.ts            # Merge tag variables config
│   ├── social-networks.ts            # Social networks config
│   ├── image-storage.ts              # Image upload & storage config
│   └── stock-images.ts               # Predefined stock images
├── data/
│   └── email-templates.ts            # Starter template definitions
├── hooks/
│   ├── useEmailBuilder.ts            # Main email builder hook
│   ├── useTranslation.ts             # Translation hook
│   └── ...                           # Other focused hooks
├── lib/
│   └── utils.ts                      # cn() helper for Tailwind (shadcn standard)
├── pages/
│   ├── DashboardPage.tsx             # Dashboard overview
│   ├── ContactsPage.tsx              # Contacts CRM
│   ├── AutomationsPage.tsx           # Workflows list
│   ├── CampaignBuilderPage.tsx      # Campaign creation flow
│   ├── FieldsPage.tsx                # Custom fields settings
│   ├── Index.tsx                     # Email Builder (original root)
│   ├── Workflow.tsx                  # Workflow Builder root
│   └── NotFound.tsx
├── types/
│   ├── email-builder.ts              # Email related types
│   └── workflow-builder.ts           # Workflow related types
└── utils/
    ├── uid.ts                        # Shared unique ID generator
    ├── exportHtml.ts                 # Email HTML export logic
    └── ...

tests/
├── setup.ts                          # Vitest setup
├── hooks/                            # Hook tests
└── utils/                            # Utility tests
```

---

## Key Conventions

### Always deliver all affected files
When asked to make a change, identify every file that needs to be touched and
deliver all of them together. Never deliver only one file if others are affected.

### File export discipline (react-refresh)

**`react-refresh/only-export-components` must never be violated.**

Vite's Fast Refresh only works correctly when a `.tsx` file exports nothing but
React components. Mixing component exports with hooks, constants, or utility
functions in the same file breaks HMR and triggers the ESLint error.

Rules:

- `.tsx` files must export **React components only** — no hooks, no constants,
  no utility functions alongside a component export.
- **Hooks** live in `.ts` files (no JSX required) under `src/hooks/` and are
  never co-exported with a component in the same file.
- **Context objects** (`React.createContext`, dictionaries, constants) live in
  `.ts` or a dedicated `.tsx` that exports **only** the Provider component.
  Non-component exports (the context object itself, shared constants) go in a
  separate `.ts` file that the Provider imports from.
- **Shared constants and factory functions** belong in `.ts` files under
  `src/config/`, `src/data/`, or `src/utils/` — never inlined into a component
  file and re-exported.

Correct split for the i18n system:

```
src/config/i18n/context.tsx   → exports TranslationProvider (component only)
src/hooks/useTranslation.ts   → exports useTranslation (hook only, pure .ts)
```

Examples:

```ts
// ✅ context.tsx — component only
export function TranslationProvider({ children }: { children: ReactNode }) { … }

// ✅ useTranslation.ts — hook only, pure .ts
export function useTranslation() { … }

// ❌ useTranslation.tsx — NEVER mix component + hook in one file
export function TranslationProvider(…) { … }
export function useTranslation() { … }
```

The same rule applies to any future context + hook pair (e.g. theme, auth,
feature flags). Always split them.

### Single source of truth for config-driven features
- **Social networks** → `src/config/social-networks.ts` only.
  Do not hardcode network names, SVG paths, or brand colors anywhere else.
  `BlockRenderer`, `PropertiesPanel`, and `exportHtml` must import from this config.
- **Personalization variables** → `src/config/personalization.ts` only.
- **Email fonts (including Google fonts)** → `src/config/email-fonts.ts` only.
  Do not hardcode font lists in components or types.
- **i18n language dictionaries** → `src/config/i18n/<lang>.ts` only.
  The `TranslationProvider` imports from these; nothing else should.
- **Image storage** → `src/config/image-storage.ts` only.
- **Stock images** → `src/config/stock-images.ts` only.

### Types
- All block/template types live in `src/types/email-builder.ts`.
- Do not use hardcoded string union types when a config array already exists.
  Derive types from config using `(typeof CONFIG_ARRAY)[number]['key']` or use `string`.
- `SocialLink.network` is `string` (not a union) so new networks need zero type changes.

### TypeScript strictness — NEVER violate these rules

**`any` is BANNED.** Never use `any` as a type annotation anywhere in production code (`src/`).
- Use `unknown` when the type is genuinely unknown, then narrow with type guards.
- Use proper generics, union types, or interface extensions instead of `any`.
- Do NOT write `as any`, `as unknown as X` without a comment explaining why the double-cast
  is unavoidable. If you find yourself reaching for `as unknown as X`, first try proper typing.

**`// @ts-ignore` and `// @ts-expect-error`** are banned without an inline comment that explains
exactly why TypeScript is wrong and the cast is safe. No blank suppression comments.

**`any` in tests** (`tests/`) is also banned in assertions and mock return values. Use the proper
type. The only allowed exception is mocking internal browser APIs (e.g. `HTMLCanvasElement.prototype.getContext`)
where JSDOM provides incomplete types — add `// JSDOM mock` comment on that line.

### State management
- All email template state lives in `useEmailBuilder` hook (`src/hooks/useEmailBuilder.ts`).
- `useEmailBuilder` is a thin composer — it delegates to three focused sub-hooks:
    - `useTemplateHistory` — undo/redo stack
    - `useBlockOps` — block CRUD and selection state
    - `useRowOps` — row CRUD
- Do not lift template state anywhere else.
- Undo/redo is handled inside `useTemplateHistory` via `undoStack` / `redoStack` refs.

### View mode (Desktop / Mobile)
- `viewMode` state lives in `Index.tsx` and is passed down as a prop.
- The toggle UI renders in `BuilderHeader.tsx` (center slot).
- `Canvas.tsx` receives `viewMode` as a prop — it does not own this state.

### Components
- Use **named exports** for all components (no `export default` in component files).
- `export default` is only used in page files (`pages/`).
- Keep components in `src/components/email-builder/` unless they are truly generic.
- Keep large feature components split into focused modules (prefer folders like
  `index-page/` and `properties-panel/` for page-specific or panel-specific logic).
- Each block type that grows beyond a `case` statement belongs in its own folder
  under `src/components/email-builder/blocks/<type>/` with `Renderer.tsx`,
  `PropsPanel.tsx`, `exportHtml.ts`, and `index.ts`.
- **Workflow nodes** belong in `src/components/workflow-builder/nodes/`.
- **UI primitives** (buttons, inputs, etc.) from **shadcn/ui** live in `src/components/ui/`.
  Always check `src/components/ui/` before creating a new basic UI component.

### Styling
- Use **Tailwind utility classes** only — no inline style objects unless strictly necessary
  (e.g. dynamic colors/sizes that cannot be expressed as static Tailwind classes).
- Use CSS variables via `hsl(var(--...))` tokens defined in `src/index.css`.
- Do not add new CSS files.

### Code style
- Comments in **English**.
- Prefer `useCallback` for all event handlers passed as props.
- Avoid inline lambdas in JSX for cross-component props (`onClick`, `onChange`, etc.).
  Create named handlers with `useCallback`.
- Inline handlers are acceptable for native form elements when they are trivial
  value passthroughs and not passed down to child components.
- **Destructure stable references before `useEffect` and `useCallback` dependency
  arrays.** Never list a parent object (`builder`, `history`, `blockOps`, etc.) in a
  dependency array — always destructure the specific ref first.

  ```ts
  // ✅ Correct
  const { undo, redo } = builder;
  useEffect(() => { ... }, [undo, redo]);

  const { setTemplate, template } = history;
  const { getSelectedBlock: getSelectedBlockOp } = blockOps;
  const getSelectedBlock = useCallback(
      () => getSelectedBlockOp(template),
      [getSelectedBlockOp, template],  // stable primitives, not `history` or `blockOps`
  );

  // ❌ Wrong — ESLint cannot verify stability of object properties
  useEffect(() => { ... }, [builder.undo, builder.redo]);
  useCallback(() => blockOps.getSelectedBlock(history.template), [blockOps, history]);
  ```

- No `eslint-disable` comments — fix the actual lint issue.

### Tests
- Keep tests in root `tests/` (not colocated in `src/`).
- Mirror production structure in test paths (`tests/hooks/*`, `tests/utils/*`, etc.).
- Name files `*.test.ts` / `*.test.tsx`.
- Any new feature, module, or behavior change must include tests in the same PR/task.
- When creating a new source file, add or update at least one relevant test file.
- Minimum expectation:
    - New hook logic → hook tests
    - New utility logic → unit tests for the utility
    - New rendering/interaction logic → component/integration tests where feasible
- If a test is truly not feasible in the current task, explicitly document why in the final report.
- **`any` is banned in tests** — see TypeScript strictness section above.

---

## Adding a New Workflow Node Type

1. Add the type string to `WorkflowNodeType` union in `src/types/workflow-builder.ts`.
2. Define the node data interface in the same file.
3. Add a case in `createDefaultNode` (if exists) or equivalent factory.
4. Create a component in `src/components/workflow-builder/nodes/` (e.g., `EmailNode.tsx`).
5. Register the node in `src/components/workflow-builder/constants.ts` (NODE_TYPES configuration).
6. Create/Update a configuration modal in `src/components/workflow-builder/modals/`.

---

## Adding a New Block Type

1. Add the type string to `BlockType` union in `src/types/email-builder.ts`
2. Define the block interface in the same file
3. Add it to the `EmailBlock` union
4. Add a case in `createDefaultBlock` in `src/hooks/createDefaultBlock.ts`
5. Create a folder `src/components/email-builder/blocks/<type>/` containing:
    - `Renderer.tsx` — JSX preview for the canvas
    - `PropsPanel.tsx` — properties panel component
    - `exportHtml.ts` — email-safe HTML export function
    - `index.ts` — barrel export
6. Add a `case` in `BlockRenderer.tsx` importing from the block folder
7. Add a branch in `PropertiesPanel.tsx` importing from the block folder
8. Add a `case` in `src/utils/exportHtml.ts` importing from the block folder
9. Add an entry in `BlockPalette.tsx`
10. Add an entry in `src/components/email-builder/index-page/block-meta.ts`
11. Add a label in `src/components/email-builder/properties-panel/constants.ts`
12. Add an entry to `CHILD_BLOCK_TYPES` in `properties-panel/conditional-props.tsx`

---

## Adding a New Social Network

Only edit `src/config/social-networks.ts` — append one entry to `SOCIAL_NETWORK_CONFIG`:

```ts
{
  key: 'bluesky',
  label: 'Bluesky',
  brandColor: '#0085FF',
  placeholder: 'https://bsky.app/profile/yourhandle',
  svgPath: 'M12 2 ...', // 24×24 viewBox, stroke-style path(s)
},
```

No other files need to change.

---

## Adding a New Language

1. Add the language code to the `Language` union in `src/config/i18n/types.ts`
2. Create `src/config/i18n/<lang>.ts` implementing the full `TranslationDictionary`
3. Import and register the dictionary in `src/config/i18n/context.tsx`
4. Add the language to `SUPPORTED_LANGUAGES` in `src/config/i18n/context.tsx`
5. Add the locale strings to `LOCALES` in `src/data/email-templates.ts`
6. Add the flag + label entry to `LANGUAGE_OPTIONS` in `src/components/email-builder/BuilderHeader.tsx`

---

## Export Format

`exportToHtml` in `src/utils/exportHtml.ts` produces a self-contained HTML email
using table-based layout for maximum email client compatibility.
SVG icons (social block) are inlined as `<svg>` tags with stroke-based rendering.
Each block type delegates its HTML rendering to its own `exportHtml.ts` inside
`src/components/email-builder/blocks/<type>/`.

---

## Floating Toolbar
- New text formatting features must be added to `ToolbarState` in `types.ts`.
- Interactions rely on standard `document.execCommand` and `document.queryCommandState` within `useFloatingToolbarState.ts`.

---

## Internationalization (i18n)
- NEVER hardcode user-facing UI text in components.
- Always use the `useTranslation` hook: `const { t } = useTranslation()`.
- Import `useTranslation` from `@/hooks/useTranslation` (the `.ts` hook file).
- Import `TranslationProvider` from `@/config/i18n/context` (the `.tsx` component file).
- Language dictionaries belong in `src/config/i18n/`.
- If a new UI string is needed, add it to the `TranslationDictionary` type in `src/config/i18n/types.ts`
  and translate it in **all** language files (`en.ts`, `ru.ts`, `uk.ts`, `it.ts`, `es.ts`, `fr.ts`)
  before using it in the component.

---

## What NOT to Do

- Do not use `localStorage` or `sessionStorage`.
- Do not add new npm packages without confirming with the user.
- Do not use `dangerouslySetInnerHTML` for user-controlled content outside of
  `BlockRenderer` (where it is intentional and controlled).
- Do not hardcode magic strings that belong in a config file.
- Do not create separate CSS files for component styles.
- Do not list parent hook objects (`history`, `blockOps`, `rowOps`) in `useCallback`
  or `useEffect` dependency arrays — destructure the specific refs first.
- **Do not use `any`.** See TypeScript strictness section.
- **Do not suppress TypeScript errors** with `@ts-ignore` or `@ts-expect-error` without an explanatory comment.
- **Do not export hooks and components from the same `.tsx` file.** See File export discipline section.
- **Do not import `TranslationProvider` from `@/hooks/useTranslation`** — it lives in `@/config/i18n/context`.