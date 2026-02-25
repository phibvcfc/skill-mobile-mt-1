# Code Review — Senior Protocol

> 🔴 Always loaded. All platforms.

---

## Checklist

### Architecture
- [ ] Single responsibility per file (max 300 lines)
- [ ] Dependencies flow inward (UI → Domain → Data)
- [ ] Follows existing project patterns
- [ ] New files in correct directory

### Correctness
- [ ] All states handled: loading, success, error, empty
- [ ] Edge cases: null, empty, timeout, concurrent
- [ ] Async errors caught with meaningful handling
- [ ] Cleanup on unmount/dispose (listeners, timers, subscriptions)
- [ ] No race conditions (double-tap, concurrent API calls)

### Performance
- [ ] Lists virtualized (FlatList / ListView.builder / LazyColumn)
- [ ] Memoized where needed (memo / const / remember)
- [ ] No inline functions in render/build
- [ ] Images cached and resized
- [ ] No main thread blocking

### Security
- [ ] No hardcoded secrets
- [ ] Secure storage for tokens (Keychain / EncryptedSharedPreferences)
- [ ] Input validated and sanitized
- [ ] Deep links validated before navigation
- [ ] No sensitive data in logs

### Platform
- [ ] Both iOS + Android tested (if cross-platform)
- [ ] Safe areas / notch handled
- [ ] Keyboard handled (dismiss, avoidance)
- [ ] Back button handled (Android)
- [ ] Accessibility labels on interactive elements

---

## Severity

| Level | Action | Example |
|-------|--------|---------|
| 🔴 CRITICAL | Must fix before merge | Crash, security hole, data loss |
| 🟠 HIGH | Should fix before merge | Memory leak, missing error state, race condition |
| 🟡 MEDIUM | Fix in follow-up | Naming inconsistency, missing memoization |
| 🔵 LOW | Nice to have | Minor style, comment improvement |

---

## Auto-Fail

**Any of these → block merge immediately:**

```
❌ console.log / print in production code
❌ Hardcoded secrets or API keys
❌ Force unwrap without null check (! / !! / as!)
❌ Empty catch blocks (error silently swallowed)
❌ 500+ line files
❌ Network call in render / build / Composable
❌ Index as list key
❌ Missing loading / error / empty state (blank screen)
```

---

## Review Comment Templates

```
🔴 CRITICAL — [file:line]
Issue: [description]
Impact: [what breaks]
Fix: [specific code change]

🟠 HIGH — [file:line]
Issue: [description]
Fix: [suggestion]

🟡 MEDIUM — [file:line]
Suggestion: [improvement]
```

---

## Example Issues

### Before (Bad)
```typescript
// ❌ No error handling, no loading state, index as key
function ProductList() {
  const [data, setData] = useState([]);
  useEffect(() => { api.get('/products').then(r => setData(r.data)); }, []);
  return data.map((item, i) => <ProductCard key={i} item={item} />);
}
```

### After (Good)
```typescript
// ✅ All states, cleanup, stable key, error handling
function ProductList() {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() => {
    let cancelled = false;
    api.get('/products')
      .then(r => { if (!cancelled) setState({ data: r.data, loading: false, error: null }); })
      .catch(e => { if (!cancelled) setState({ data: [], loading: false, error: e.message }); });
    return () => { cancelled = true; };
  }, []);

  if (state.loading) return <LoadingSkeleton />;
  if (state.error) return <ErrorView message={state.error} onRetry={refresh} />;
  if (!state.data.length) return <EmptyState />;
  return <FlatList data={state.data} keyExtractor={item => item.id} renderItem={...} />;
}
```
