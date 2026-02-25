# Flutter — Production Patterns

> Battle-tested patterns from production Flutter apps.
> State: Riverpod (standard)
> DI: get_it + injectable
> Networking: Dio + Retrofit, or http
> Navigation: GoRouter

---

## Clean Architecture

```
lib/
├── main.dart                     # Entry: Firebase init, Hive init, ProviderScope
├── app/
│   ├── app.dart                  # MaterialApp.router
│   ├── router.dart               # GoRouter config
│   └── theme/
├── features/
│   ├── auth/
│   │   ├── domain/               # Entities + use cases + repository interfaces
│   │   ├── data/                 # Repository impl, API client, DTOs, mappers
│   │   ├── presentation/         # Screens + widgets
│   │   └── providers/            # Riverpod providers
│   └── [feature]/
│       └── ... (same structure)
├── shared/
│   ├── widgets/                  # Reusable UI
│   ├── extensions/
│   └── utils/
└── core/
    ├── network/                  # Dio client setup, interceptors
    ├── storage/                  # Hive + SharedPrefs + flutter_secure_storage
    ├── di/                       # get_it + injectable setup
    └── constants/
```

### Dependency Rule
```
presentation/ → domain/ ← data/

Presentation depends on Domain. Data depends on Domain.
Domain depends on NOTHING.
Never import data/ from presentation/ directly.
Use cases call repository interfaces (defined in domain/).
Data layer provides implementations.
```

## State Management (Riverpod)

```dart
// domain/usecases/get_products.dart
class GetProducts {
  final ProductRepository repository;
  GetProducts(this.repository);
  Future<List<Product>> call() => repository.getProducts();
}

// features/product/providers/product_providers.dart
@riverpod
class ProductList extends _$ProductList {
  @override
  FutureOr<List<Product>> build() async {
    final repo = ref.read(productRepositoryProvider);
    return repo.getProducts();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repo = ref.read(productRepositoryProvider);
      return repo.getProducts();
    });
  }
}

// features/product/presentation/product_screen.dart
class ProductScreen extends ConsumerWidget {
  const ProductScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(productListProvider);
    return products.when(
      data: (list) => list.isEmpty
          ? const EmptyState()
          : ListView.builder(
              itemCount: list.length,
              itemBuilder: (_, i) => ProductCard(product: list[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => ErrorState(onRetry: () => ref.invalidate(productListProvider)),
    );
  }
}
```

## Dependency Injection (get_it + injectable)

```dart
// core/di/injection.dart
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';

final getIt = GetIt.instance;

@InjectableInit()
void configureDependencies() => getIt.init();

// Usage: annotate classes
@injectable
class AuthRepository {
  final ApiClient _client;
  AuthRepository(this._client);
}
```

## Navigation (GoRouter)

```dart
final router = GoRouter(
  redirect: (context, state) {
    final isAuth = authNotifier.isAuthenticated;
    final isAuthRoute = state.matchedLocation.startsWith('/auth');
    if (!isAuth && !isAuthRoute) return '/auth/login';
    if (isAuth && isAuthRoute) return '/';
    return null;
  },
  routes: [
    ShellRoute(
      builder: (_, __, child) => MainScaffold(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      ],
    ),
    GoRoute(path: '/auth/login', builder: (_, __) => const LoginScreen()),
  ],
);
```

## Networking

### Dio + Retrofit

```dart
@RestApi(baseUrl: ApiConstants.baseUrl)
abstract class ApiClient {
  factory ApiClient(Dio dio) = _ApiClient;

  @GET('/products')
  Future<ApiResponse<List<ProductDto>>> getProducts();

  @POST('/auth/login')
  Future<ApiResponse<AuthDto>> login(@Body() LoginInput input);
}

// Dio setup with interceptors
final dio = Dio(BaseOptions(
  baseUrl: ApiConstants.baseUrl,
  connectTimeout: const Duration(seconds: 15),
))
  ..interceptors.addAll([
    AuthInterceptor(secureStorage),
    PrettyDioLogger(requestBody: true, responseBody: true),
    RetryInterceptor(dio: dio, retries: 2),
  ]);
```

### HTTP (simpler pattern)

```dart
final response = await http.get(
  Uri.parse('$baseUrl/endpoint'),
  headers: {'Authorization': 'Bearer $token'},
);
```

## Local Storage

```dart
// Hive (structured data)
await Hive.initFlutter();
Hive.registerAdapter(UserAdapter());
final box = await Hive.openBox<User>('users');

// Floor (Room-like SQL)
@dao
abstract class ProductDao {
  @Query('SELECT * FROM products')
  Future<List<ProductEntity>> getAll();

  @Insert(onConflict: OnConflictStrategy.replace)
  Future<void> insertAll(List<ProductEntity> products);
}

// SharedPreferences (simple key-value)
final prefs = await SharedPreferences.getInstance();

// flutter_secure_storage (tokens)
final storage = const FlutterSecureStorage();
await storage.write(key: 'token', value: token);
```

## Firebase

```dart
// Firebase init in main.dart
await Firebase.initializeApp();
await FirebaseMessaging.instance.requestPermission();

// Firestore
final doc = await FirebaseFirestore.instance.collection('users').doc(uid).get();

// FCM push
FirebaseMessaging.onMessage.listen((message) {
  // Handle foreground notification
});
```

## Key Libraries

| Purpose | Library |
|---------|---------|
| State | flutter_riverpod |
| DI | get_it + injectable |
| HTTP | dio + retrofit |
| HTTP | http |
| DB | floor |
| DB | hive |
| Router | go_router |
| UI | flutter_screenutil |
| Anim | flutter_animate |
| Auth | local_auth (biometric) |
| Crypto | encrypt, crypto |
| Forms | formz |
| Func | dartz (Either, Option) |
| Models | freezed_annotation |
| Firebase | firebase_core, messaging, firestore |
| Image | cached_network_image |

---

> Standard: Riverpod + get_it/injectable + Clean Architecture.
> Dio/Retrofit for complex APIs. Floor for offline-first. Firebase for push/analytics.
