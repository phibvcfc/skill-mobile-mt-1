# Skill Mobile MT — Agent Rules

> Multi-agent compatibility layer for Claude Code, Codex, Gemini CLI, Kimi, Cursor, Copilot, Windsurf, Antigravity, and all Agent Skills-compatible tools.

---

## Agent Compatibility Matrix

| Agent | Skill Path | Invocation | Think Block |
|-------|-----------|------------|-------------|
| Claude Code | `~/.claude/skills/skill-mobile-mt/` | `@skill-mobile-mt` or `@skill-mobile-mt local` | `<think>...</think>` |
| Codex | `~/.codex/skills/skill-mobile-mt/` | `@skill-mobile-mt` or load as context | `<think>...</think>` |
| Gemini CLI | `~/.gemini/skills/skill-mobile-mt/` | Load as context | `## Thinking:` block |
| Kimi | `~/.kimi/skills/skill-mobile-mt/` | Load as context | `【思考】` or markdown |
| Cursor | `~/.cursor/skills/skill-mobile-mt/` | Auto-loaded in Composer | Inline reasoning |
| Copilot | `~/.copilot/skills/skill-mobile-mt/` | Loaded via workspace | `// PLAN:` comments |
| Windsurf | `~/.windsurf/skills/skill-mobile-mt/` | Auto-loaded | Inline reasoning |
| Antigravity | `~/.agents/skills/skill-mobile-mt/` | Loaded by orchestrator | Agent-native format |

---

## Antigravity Configuration

```yaml
skill:
  name: skill-mobile-mt
  version: "1.0.0"
  author: buivietphi
  category: engineering
  tags:
    - mobile
    - react-native
    - flutter
    - ios
    - android
    - clean-architecture
    - code-review
    - senior

  modes:
    default:
      description: "Use pre-built production patterns from 18 real mobile apps"
      loads:
        - SKILL.md
        - "{detected-platform}/{platform}.md"
        - shared/code-review.md
        - shared/bug-detection.md
        - shared/prompt-engineering.md

    local:
      description: "Read current project, adapt to its framework and conventions"
      argument: "local"
      loads:
        - SKILL.md (Section: Local Project Adaptation)
        - "{detected-platform}/{platform}.md"
        - shared/code-review.md
        - shared/bug-detection.md
        - shared/prompt-engineering.md

  platform_detection:
    react-native:
      detect: "package.json contains 'react-native' or 'expo'"
      load: "react-native/react-native.md"
    flutter:
      detect: "pubspec.yaml exists"
      load: "flutter/flutter.md"
    ios:
      detect: "*.xcodeproj or *.xcworkspace exists (without pubspec.yaml)"
      load: "ios/ios-native.md"
    android:
      detect: "build.gradle exists (without package.json or pubspec.yaml)"
      load: "android/android-native.md"

  language_detection:
    typescript: ".tsx/.ts files in src/"
    javascript: ".jsx/.js files in src/"
    dart: ".dart files in lib/"
    swift: ".swift files"
    kotlin: ".kt files"
    java: ".java files in app/src/"

  context_budget:
    max_tokens: 15000
    smart_load_tokens: 8000
    savings: "~47%"
```

---

## File Loading Rules for All Agents

### Smart Loading Protocol

Every agent MUST follow this loading sequence:

```
1. ALWAYS load: SKILL.md (entry point, auto-detect, universal principles)

2. AUTO-DETECT project:
   - Framework (React Native / Flutter / iOS / Android)
   - Language (TypeScript / JavaScript / Dart / Swift / Kotlin / Java)
   - Package manager (yarn / npm / pnpm / bun / flutter pub / pod)
   - State management
   - Navigation

3. LOAD the matching platform subfolder:
   - react-native/react-native.md  (only if RN/Expo)
   - flutter/flutter.md            (only if Flutter)
   - ios/ios-native.md             (only if iOS native)
   - android/android-native.md     (only if Android native)

4. Cross-platform? Load multiple:
   - Flutter → also load ios/ + android/ (native modules)
   - React Native → also load ios/ + android/ (native modules)

5. ALWAYS load shared/:
   - shared/code-review.md
   - shared/bug-detection.md
   - shared/prompt-engineering.md

6. SKIP non-matching platform subfolders (saves ~60% context)
```

### Loading Priority

```
Priority 1 (CRITICAL):  SKILL.md — Auto-detect, mode selection, principles
Priority 2 (HIGH):      {platform}/{platform}.md — Framework-specific patterns
Priority 3 (MEDIUM):    shared/code-review.md — Review checklist
Priority 4 (MEDIUM):    shared/bug-detection.md — Auto-scanner
Priority 5 (LOW):       shared/prompt-engineering.md — Auto-think templates
```

---

## Agent-Specific Behavior

### Claude Code
- Supports `$ARGUMENTS` — use `local` to trigger local mode
- Can invoke sub-files via Read tool from subfolders
- Full tool access for project scanning and auto-detect

### Gemini CLI
- Load SKILL.md as system context
- Parse mode from user prompt ("use local mode" or default)
- Reference subfolder files as needed

### Kimi
- Load SKILL.md as knowledge base
- Supports both Chinese and English prompts
- Think blocks use `【思考】` format

### Cursor / Copilot / Windsurf
- Auto-loaded when skill directory detected in workspace
- Mode determined by presence of project files in workspace
- Think blocks embedded as comments before code

### Antigravity
- Orchestrator loads based on detected project type
- Follows `platform_detection` rules above
- Respects `context_budget` limits

---

## Installation Paths

```bash
# Claude Code (global)
~/.claude/skills/skill-mobile-mt/

# Claude Code (project-local)
.claude/skills/skill-mobile-mt/

# Gemini CLI
~/.gemini/skills/skill-mobile-mt/

# Kimi
~/.kimi/skills/skill-mobile-mt/

# Cursor
~/.cursor/skills/skill-mobile-mt/

# Windsurf
~/.windsurf/skills/skill-mobile-mt/

# Copilot
~/.copilot/skills/skill-mobile-mt/

# Antigravity (shared agent directory)
~/.agents/skills/skill-mobile-mt/

# Custom path
npx @buivietphi/skill-mobile --path /your/custom/path
```

---

## Metadata

```json
{
  "id": "skill-mobile-mt",
  "name": "skill-mobile-mt",
  "version": "1.0.0",
  "author": "buivietphi",
  "category": "engineering",
  "description": "Master Senior Mobile Engineer. Pre-built patterns from 18 production apps + local project adaptation. Auto-detects language and framework. React Native, Flutter, iOS, Android.",
  "risk": "low",
  "source": "buivietphi (MIT)",
  "platforms": ["react-native", "flutter", "ios", "android"],
  "languages": ["typescript", "javascript", "dart", "swift", "kotlin", "java"],
  "agents": ["claude-code", "gemini", "kimi", "cursor", "copilot", "windsurf", "antigravity"]
}
```
