# Prompt Engineering — Auto-Think

> Always loaded. Works with Claude, Gemini, Kimi, Cursor, Copilot.

---

## Auto-Think: Generate Before Every Action

### Fix / Debug
```
<think>
BUG: [description]
FILE: [path]
ROOT CAUSE: [analyze code flow, don't guess]
FIX: [specific change + why it works]
SIDE EFFECTS: [what else could break]
TEST: [how to verify]
</think>
```

### Build / Create (Local Mode — project exists)
```
<think>
FEATURE: [description]
SCAN: [list top-level folders in src/ or app/ or lib/]
PATTERN: [feature-based / layer-based / hybrid]
REFERENCE: [most similar existing feature + full path]
DATA SOURCE: [API (axios/fetch) / Firebase / GraphQL / local — detected from reference]
STATE MGMT: [Redux / Zustand / MobX / BLoC / Context — detected from reference]
CLONE:
  reference/Screen.tsx    → new-feature/Screen.tsx
  reference/useHook.ts    → new-feature/useHook.ts
  reference/service.ts    → new-feature/service.ts
  reference/types.ts      → new-feature/types.ts
  reference/slice.ts      → new-feature/slice.ts
STATES: loading / error / empty / success
DEPS: [new packages needed? ASK user before adding]
</think>
```

### Build / Create (Default Mode — new project or no reference)
```
<think>
FEATURE: [description]
REFERENCE: [platform reference file pattern from skill]
LOCATION: [where files go per Clean Architecture]
PLAN:
1. [file] — [purpose]
2. [file] — [purpose]
DEPS: [needed? use correct pkg manager]
STATES: loading / error / empty / success
</think>
```

### Review / Audit
```
<think>
SCOPE: [files/feature to review]
SCAN: crash → leaks → perf → security → UX
OUTPUT: file:line — severity — issue — fix
</think>
```

### Refactor
```
<think>
TARGET: [what to improve]
CONSTRAINT: no behavior change, no new deps, match conventions
PLAN: [steps]
</think>
```

---

## Multi-AI Format

| AI | Think Format |
|----|-------------|
| Claude | `<think>...</think>` |
| Gemini | `## Thinking:` block |
| Kimi | `【思考】` or markdown |
| Cursor | Inline in Composer |
| Copilot | `// PLAN:` comments |

## Context Template (Provide Before Every Task)

```
PROJECT: [name]
FRAMEWORK: [RN/Flutter/iOS/Android]
PKG MANAGER: [yarn/npm/flutter pub/pod/gradle]
REFERENCE FILE: [path to similar existing code]
```

## Good vs Bad Prompts

```
✅ "Fix crash in ProductDetail when images is null"
✅ "Create search screen following pattern in src/screens/HomeScreen"
✅ "Review cart feature for memory leaks"

❌ "Make this better"
❌ "Fix all bugs"
❌ "Use best practices"
```
