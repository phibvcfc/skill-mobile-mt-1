# Android Native — Production Patterns

> Battle-tested patterns for Android Kotlin development.
> Multi-module Gradle, Hilt DI, Compose UI, offline-first.
> Also reference for RN/Flutter Android-side issues.

---

## Clean Architecture (Multi-Module)

```
project/
├── app/                          # Main application module
│   ├── src/main/
│   │   ├── java/com/company/app/
│   │   │   ├── di/              # Hilt modules
│   │   │   ├── presentation/
│   │   │   │   ├── features/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── ui/     # Composables
│   │   │   │   │   │   └── viewmodel/
│   │   │   │   │   └── home/
│   │   │   │   ├── navigation/
│   │   │   │   └── theme/
│   │   │   └── domain/
│   │   │       ├── model/        # Domain entities
│   │   │       ├── usecase/      # Business rules
│   │   │       └── repository/   # Repository interfaces
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── data/                         # Data layer module
│   ├── src/main/java/
│   │   ├── repository/           # Repository implementations
│   │   ├── remote/               # API service, DTOs
│   │   ├── local/                # Room DAOs, entities
│   │   └── mapper/               # DTO ↔ Entity ↔ Domain mappers
│   └── build.gradle.kts
├── common/                       # Shared utilities module
│   └── src/main/java/
├── build.gradle.kts              # Root build file
├── settings.gradle.kts           # Module declarations
└── gradle/
    └── libs.versions.toml        # Version catalog
```

### Dependency Rule
```
app (presentation) → domain/ ← data/

Presentation depends on Domain. Data depends on Domain.
Domain depends on NOTHING.
app module has access to all modules.
data module implements domain interfaces.
```

## Compose UI Pattern

```kotlin
@Composable
fun ProductListScreen(
    viewModel: ProductListViewModel = hiltViewModel(),
    onProductClick: (String) -> Unit,
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = { TopAppBar(title = { Text("Products") }) },
    ) { padding ->
        when (val state = uiState) {
            is UiState.Loading -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                CircularProgressIndicator()
            }
            is UiState.Empty -> EmptyContent()
            is UiState.Error -> ErrorContent(state.message, onRetry = viewModel::load)
            is UiState.Success -> LazyColumn(
                modifier = Modifier.padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(state.data, key = { it.id }) { product ->
                    ProductCard(product, onClick = { onProductClick(product.id) })
                }
            }
        }
    }
}

sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data object Empty : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}
```

## ViewModel (Hilt)

```kotlin
@HiltViewModel
class ProductListViewModel @Inject constructor(
    private val getProducts: GetProductsUseCase,
) : ViewModel() {
    private val _uiState = MutableStateFlow<UiState<List<Product>>>(UiState.Loading)
    val uiState = _uiState.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            getProducts()
                .catch { _uiState.value = UiState.Error(it.message ?: "Error") }
                .collect { items ->
                    _uiState.value = if (items.isEmpty()) UiState.Empty else UiState.Success(items)
                }
        }
    }
}
```

## DI (Hilt)

```kotlin
@Module @InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
        .build()
}

@Module @InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds @Singleton
    abstract fun bindProductRepo(impl: ProductRepositoryImpl): ProductRepository
}
```

## Data Layer (Retrofit + Room — Offline-First)

```kotlin
// data/remote/ProductApi.kt
interface ProductApi {
    @GET("products") suspend fun getProducts(): ApiResponse<List<ProductDto>>
}

// data/local/ProductDao.kt
@Dao interface ProductDao {
    @Query("SELECT * FROM products") fun getAll(): Flow<List<ProductEntity>>
    @Upsert suspend fun upsertAll(items: List<ProductEntity>)
}

// data/repository/ProductRepositoryImpl.kt
class ProductRepositoryImpl @Inject constructor(
    private val api: ProductApi, private val dao: ProductDao,
) : ProductRepository {
    override fun getProducts(): Flow<List<Product>> = flow {
        val cached = dao.getAll().first()
        if (cached.isNotEmpty()) emit(cached.map { it.toDomain() })
        try {
            val fresh = api.getProducts()
            dao.upsertAll(fresh.data.map { it.toEntity() })
        } catch (e: Exception) { if (cached.isEmpty()) throw e }
        emitAll(dao.getAll().map { it.map { e -> e.toDomain() } })
    }
}
```

## Secure Storage

```kotlin
val prefs = EncryptedSharedPreferences.create(
    context, "secure_prefs",
    MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
)
```

## Multi-Module Gradle Setup

```kotlin
// settings.gradle.kts
include(":app", ":data", ":common")

// app/build.gradle.kts
dependencies {
    implementation(project(":data"))
    implementation(project(":common"))
}
```

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| `!!` assertion | `?.` / `?:` / `requireNotNull` |
| `collectAsState` | `collectAsStateWithLifecycle()` |
| Context leak | `@ApplicationContext`, never Activity |
| Missing ProGuard | Test release builds |
| Main thread blocking | `Dispatchers.IO` |

---

> Multi-module Gradle + Hilt + Compose + offline-first.
> Clean Architecture with domain module having zero dependencies.
