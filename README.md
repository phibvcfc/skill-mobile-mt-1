# @buivietphi/skill-mobile

**Master Senior Mobile Engineer** — AI skill for Claude Code, Codex, Gemini CLI, Kimi, Cursor, Copilot, Windsurf, and Antigravity.

Pre-built architecture patterns from **18 production mobile apps** + auto-adaptation to your current project.

## Install

```bash
npx @buivietphi/skill-mobile
```

Interactive mode — detects which AI agents are installed and prompts you.

### Install to specific agents

```bash
npx @buivietphi/skill-mobile --claude       # Claude Code only
npx @buivietphi/skill-mobile --codex        # Codex only
npx @buivietphi/skill-mobile --gemini       # Gemini CLI only
npx @buivietphi/skill-mobile --kimi         # Kimi only
npx @buivietphi/skill-mobile --antigravity  # Antigravity only
npx @buivietphi/skill-mobile --all          # All detected agents
npx @buivietphi/skill-mobile --path ./dir   # Custom directory
```

## Usage

### Mode 1: Pre-Built Architecture (default)

```
@skill-mobile-mt
```

Uses battle-tested patterns extracted from real production apps:
- **10 React Native apps** — Redux, MobX, Apollo/GraphQL, React Navigation
- **3 Flutter apps** — Riverpod, Clean Architecture, Dio, GoRouter
- **4 Android Native apps** — Multi-module Gradle, Hilt, Compose, Room
- **1 iOS Native app** — Swift, MVVM, CocoaPods, Combine

### Mode 2: Adapt to Your Project (local)

```
@skill-mobile-mt local
```

Reads your current project first, then follows **your** conventions:
- Detects framework, language, package manager, state management, navigation
- Matches your naming, imports, file structure, patterns
- Never suggests migrations or imposes different architecture

## Auto-Detect

The skill automatically detects before any action:

| What | How |
|------|-----|
| **Framework** | `pubspec.yaml` → Flutter, `package.json` with `react-native` → RN, `*.xcodeproj` → iOS, `build.gradle` → Android |
| **Language** | `.dart` → Dart, `.tsx/.ts` → TypeScript, `.swift` → Swift, `.kt` → Kotlin |
| **Package Manager** | `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm, `package-lock.json` → npm, `pubspec.lock` → flutter pub |
| **State Management** | Redux / MobX / Zustand / Riverpod / BLoC / StateFlow / Combine |
| **Navigation** | React Navigation / Expo Router / GoRouter / NavigationStack |

## Smart Loading

Only loads the relevant platform docs — saves **~60% context tokens**.

```
Flutter project?
  → Load: flutter/flutter.md + ios/ + android/ + shared/
  → Skip: react-native/

React Native project?
  → Load: react-native/react-native.md + ios/ + android/ + shared/
  → Skip: flutter/

iOS only?
  → Load: ios/ios-native.md + shared/
  → Skip: flutter/ + react-native/ + android/
```

## Context Cost

| Scenario | Tokens | % of 128K | % of 200K |
|----------|-------:|----------:|----------:|
| SKILL.md only | ~4,000 | 3.1% | 2.0% |
| + 1 platform + shared/ | ~12,000 | 9.4% | 6.0% |
| Cross-platform (RN/Flutter + iOS + Android) | ~16,000 | 12.5% | 8.0% |
| All files loaded | ~26,300 | 20.5% | 13.2% |
| **Smart load (recommended)** | **~12,000** | **9.4%** | **6.0%** |

### Per-file token breakdown

| File | Tokens |
|------|-------:|
| `SKILL.md` | 4,011 |
| `AGENTS.md` | 1,541 |
| `react-native/react-native.md` | 5,108 |
| `flutter/flutter.md` | 1,617 |
| `ios/ios-native.md` | 1,452 |
| `android/android-native.md` | 1,659 |
| `shared/code-review.md` | 865 |
| `shared/bug-detection.md` | 499 |
| `shared/prompt-engineering.md` | 3,927 |
| `shared/common-pitfalls.md` | 1,160 |
| `shared/error-recovery.md` | 2,435 |
| `shared/release-checklist.md` | 587 |
| **Total** | **26,303** |

## Installed Structure

```
~/.claude/skills/               (or ~/.gemini/skills/, ~/.agents/skills/, etc.)
└── skill-mobile-mt/
    ├── SKILL.md                    Entry point + auto-detect
    ├── AGENTS.md                   Multi-agent compatibility
    ├── react-native/
    │   └── react-native.md         React Native patterns
    ├── flutter/
    │   └── flutter.md              Flutter patterns
    ├── ios/
    │   └── ios-native.md           iOS Swift patterns
    ├── android/
    │   └── android-native.md       Android Kotlin patterns
    └── shared/
        ├── code-review.md          Senior review checklist
        ├── bug-detection.md        Auto bug scanner
        ├── prompt-engineering.md   Intelligent prompt generation
        ├── common-pitfalls.md      Problem → Symptoms → Solution
        ├── error-recovery.md       Fix build/runtime errors
        └── release-checklist.md    Pre-release verification
```

## What's Included

### Clean Architecture & SOLID
- Dependencies flow inward (UI → Domain → Data)
- Single responsibility per file (max 300 lines)
- Dependency injection, no hardcoded singletons

### Code Review Protocol
- Architecture, correctness, performance, security, platform checklists
- Severity levels: Critical / High / Medium / Low
- Auto-fail patterns (console.log in production, hardcoded secrets, empty catch blocks)

### Bug Detection Scanner
- Crash risks, memory leaks, race conditions
- Security vulnerabilities, performance issues, UX problems
- Platform-specific detection rules

### Intelligent Prompt Engineering
- XML tag structure for clarity (`<task>`, `<context>`, `<instructions>`, `<constraints>`)
- Enhanced auto-think templates with 4-phase build process
- Progressive context loading (5 levels: overview → pattern → files → docs → expert)
- Just-in-time file reading (grep first, read only needed)
- Reference pattern system (clone existing instead of reading docs)
- Multi-AI format support (Claude, Gemini, Kimi, Cursor, Copilot, Windsurf)

### Error Recovery
- 16 common build/runtime errors with concrete fixes
- Platform-specific solutions (RN CLI, Expo, Flutter, iOS, Android)
- General recovery protocol for systematic debugging

### Release & Review
- Pre-release checklist for App Store and Play Store submissions
- Common pitfalls with Problem → Symptoms → Solution format
- Security audit patterns

### Security Non-Negotiables
- No hardcoded secrets
- Secure token storage (Keychain / EncryptedSharedPreferences / SecureStore)
- Deep link validation, HTTPS only

## Supported Agents

| Agent | Install Path | Status |
|-------|-------------|--------|
| Claude Code | `~/.claude/skills/skill-mobile-mt/` | Full support |
| Codex | `~/.codex/skills/skill-mobile-mt/` | Full support |
| Gemini CLI | `~/.gemini/skills/skill-mobile-mt/` | Full support |
| Kimi | `~/.kimi/skills/skill-mobile-mt/` | Full support |
| Cursor | `~/.cursor/skills/skill-mobile-mt/` | Full support |
| Copilot | `~/.copilot/skills/skill-mobile-mt/` | Full support |
| Windsurf | `~/.windsurf/skills/skill-mobile-mt/` | Full support |
| Antigravity | `~/.agents/skills/skill-mobile-mt/` | Full support |

## License

MIT — by [buivietphi](https://github.com/buivietphi)
