# Bug Detection — Auto Scanner

> Always loaded. All platforms.

---

## Scan Order (by severity)

### 1. Crash Risks (CRITICAL)
```
├── Force unwrap (! / !! / non-null assertion)
├── Array out of bounds
├── Unhandled null on API response
├── Missing try/catch on async ops
├── Missing error boundaries (RN)
├── Infinite recursion
└── Division by zero
```

### 2. Memory Leaks (HIGH)
```
RN:      useEffect without cleanup, listeners not removed, timers not cleared
Flutter: StreamSubscription/Controller not disposed
iOS:     [weak self] missing, observers not removed
Android: Context leak, BroadcastReceiver not unregistered
```

### 3. Race Conditions (HIGH)
```
├── Button tappable during async op → add isSubmitting flag
├── setState after unmount → track mounted state
├── Multiple 401s → queue token refresh
└── Optimistic update without rollback → save previous state
```

### 4. Security (HIGH)
```
├── Hardcoded secrets → env / secure config
├── Tokens in AsyncStorage/SharedPrefs → SecureStore/Keychain
├── Sensitive data in logs → strip before logging
├── Deep links unvalidated → validate params
└── Debug mode in release → strip debug flags
```

### 5. Performance (MEDIUM)
```
├── ScrollView for long lists → FlatList/ListView.builder/LazyColumn
├── Inline functions in render → useCallback/memo/const
├── Index as key → stable unique ID
├── Large images unoptimized → resize, cache
├── Main thread blocking → background thread
└── Missing pagination → add cursor/offset
```

### 6. UX (MEDIUM)
```
├── Touch targets < 44pt/48dp
├── Missing loading/error/empty states
├── No keyboard dismiss
├── Missing safe area handling
└── No accessibility labels
```

## Report Format

```
🐛 [SEVERITY] — [file:line]
   Issue:  [description]
   Impact: [what breaks]
   Fix:    [code change]
```
