# Product Catalog - Implementace Redis Cache

Fullstack webová aplikace pro správu produktového katalogu e-shopu s implementací Redis cache vrstvy pro optimalizaci databázových dotazů.

## Obsah

- [Popis projektu](#popis-projektu)
- [Technologie](#technologie)
- [Architektura](#architektura)
- [Instalace a spuštění](#instalace-a-spuštění)
- [Struktura projektu](#struktura-projektu)
- [API dokumentace](#api-dokumentace)
- [Cache strategie](#cache-strategie)
- [Testování](#testování)

## Popis projektu

Aplikace demonstruje praktickou implementaci Redis jako cache vrstvy mezi aplikační logikou a relační databází PostgreSQL. Systém implementuje inteligentní cachování s automatickou invalidací při změnách dat a poskytuje real-time statistiky výkonu cache.

### Hlavní funkce

- Kompletní CRUD operace pro správu produktů
- Pokročilé vyhledávání s full-text dotazy a filtrováním podle kategorií
- Redis cache vrstva s TTL (Time To Live) managementem
- Automatická invalidace cache při modifikaci dat
- Real-time analýza výkonu cache (hit rate, miss rate)
- RESTful API architektura
- Responzivní webové rozhraní
- Docker-based deployment

## Technologie

### Backend

- **Node.js 20** - runtime prostředí
- **Express.js** - webový framework
- **TypeScript** - type-safe JavaScript
- **PostgreSQL 16** - relační databáze
- **Redis Stack** - cache vrstva s RedisInsight UI
- **Prisma ORM** - databázová abstrakce a query builder
- **Zod** - runtime validace typů

### Frontend

- **React 18** - UI framework
- **TypeScript** - type-safe development
- **Vite** - build tool a dev server
- **TailwindCSS** - utility-first CSS framework
- **React Router v6** - client-side routing
- **Axios** - HTTP klient

### Infrastruktura

- **Docker** - kontejnerizace aplikace
- **Docker Compose** - orchestrace služeb
- **Nginx** - produkční web server

## Architektura

### Systémové komponenty

```
┌─────────────┐      HTTP       ┌─────────────┐
│   Browser   │ ────────────> │   Nginx     │
│  (Client)   │                 │  (Frontend) │
└─────────────┘                 └─────────────┘
                                       │
                                       │ REST API
                                       ▼
                                ┌─────────────┐
                                │   Express   │
                                │  (Backend)  │
                                └─────────────┘
                                   │       │
                        ┌──────────┘       └──────────┐
                        ▼                              ▼
                 ┌─────────────┐              ┌─────────────┐
                 │    Redis    │              │ PostgreSQL  │
                 │   (Cache)   │              │    (DB)     │
                 └─────────────┘              └─────────────┘
```

### Data Flow

1. **Request** - Klient odešle HTTP request na API endpoint
2. **Cache Check** - Backend nejprve dotazuje Redis cache
3. **Cache Hit** - Pokud data existují v cache, vrátí se přímo
4. **Cache Miss** - Pokud data nejsou v cache, dotazuje se PostgreSQL
5. **Cache Update** - Výsledek z databáze se uloží do Redis s TTL
6. **Response** - Data se vrátí klientovi s informací o zdroji (cache/database)

### Cache Invalidation Flow

1. **Mutation** - CREATE/UPDATE/DELETE operace na produktu
2. **Specific Key Delete** - Smazání konkrétního produktu z cache
3. **Pattern Delete** - Invalidace všech souvisejících list/search cache
4. **Database Update** - Provedení změny v PostgreSQL
5. **Response** - Potvrzení operace klientovi

## Instalace a spuštění

### Požadavky

- Docker Desktop 4.x nebo novější
- Docker Compose v2.x nebo novější
- Git

### Rychlé spuštění

```bash
# Klonování repozitáře
git clone <repository-url>
cd product-catalog

# Vytvoření environment souborů
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Spuštění všech služeb
docker-compose up -d

# Sledování logů
docker-compose logs -f
```

### Přístup k aplikaci

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **RedisInsight**: http://localhost:8001
- **PostgreSQL**: localhost:5432

### Vypnutí služeb

```bash
# Zastavení kontejnerů
docker-compose down

# Zastavení a smazání volumes (data)
docker-compose down -v
```

## Struktura projektu

```
product-catalog/
├── backend/
│   ├── src/
│   │   ├── config/              # Konfigurace databáze a Redis
│   │   │   ├── database.ts      # Prisma client setup
│   │   │   └── redis.ts         # Redis client setup
│   │   ├── services/            # Business logika
│   │   │   ├── cache.service.ts # Cache management a strategie
│   │   │   └── product.service.ts # Produktová logika s cache integrací
│   │   ├── controllers/         # Request handlers
│   │   │   └── product.controller.ts
│   │   ├── routes/              # API route definice
│   │   │   └── product.routes.ts
│   │   ├── middleware/          # Express middleware
│   │   │   └── errorHandler.ts
│   │   ├── types/               # TypeScript type definice
│   │   │   └── index.ts
│   │   └── index.ts             # Aplikační entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Databázové schéma
│   │   └── seed.ts              # Seed data script
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Layout komponenty
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── common/          # Sdílené komponenty
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── ErrorMessage.tsx
│   │   │   │   └── CacheIndicator.tsx
│   │   │   └── products/        # Produktové komponenty
│   │   │       ├── ProductCard.tsx
│   │   │       ├── ProductList.tsx
│   │   │       ├── ProductForm.tsx
│   │   │       └── SearchBar.tsx
│   │   ├── pages/               # Page komponenty
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── AddProductPage.tsx
│   │   │   ├── EditProductPage.tsx
│   │   │   └── CacheStatsPage.tsx
│   │   ├── services/            # API integrace
│   │   │   └── api.ts
│   │   ├── types/               # TypeScript typy
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## API dokumentace

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Produkty

**GET /products**
```
Získání seznamu produktů s podporou pagination, vyhledávání a filtrování

Query parametry:
  - page: číslo stránky (default: 1)
  - limit: počet produktů na stránku (default: 12)
  - search: vyhledávací dotaz (optional)
  - category: filtr kategorie (optional)

Response:
{
  "success": true,
  "data": [Product[]],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "totalPages": 3
  },
  "cache": {
    "hit": true,
    "source": "redis"
  }
}
```

**GET /products/:id**
```
Získání detailu produktu podle ID

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "price": number,
    "category": "string",
    "imageUrl": "string",
    "stock": number,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "cache": {
    "hit": false,
    "source": "database"
  }
}
```

**POST /products**
```
Vytvoření nového produktu

Request Body:
{
  "name": "string (required)",
  "description": "string (required)",
  "price": number (required),
  "category": "string (required)",
  "imageUrl": "string (optional)",
  "stock": number (required)
}

Response:
{
  "success": true,
  "data": Product
}
```

**PUT /products/:id**
```
Aktualizace existujícího produktu

Request Body: (všechna pole optional)
{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "imageUrl": "string",
  "stock": number
}

Response:
{
  "success": true,
  "data": Product
}
```

**DELETE /products/:id**
```
Smazání produktu

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### Kategorie

**GET /categories**
```
Získání seznamu všech kategorií

Response:
{
  "success": true,
  "data": ["Electronics", "Clothing", "Books", ...]
}
```

#### Cache management

**GET /cache/stats**
```
Získání statistik cache

Response:
{
  "success": true,
  "data": {
    "hits": 150,
    "misses": 50,
    "hitRate": "75.00%"
  }
}
```

**POST /cache/flush**
```
Vymazání celé cache

Response:
{
  "success": true,
  "message": "Cache flushed successfully"
}
```

## Cache strategie

### Struktura klíčů

```
product:{id}                              # Detail produktu (TTL: 600s)
products:list:{page}:{limit}              # Seznam produktů (TTL: 300s)
products:search:{query}:{category}:{page} # Výsledky vyhledávání (TTL: 180s)
```

### Time To Live (TTL)

- **Product detail**: 600 sekund (10 minut)
- **Product list**: 300 sekund (5 minut)
- **Search results**: 180 sekund (3 minuty)

### Invalidační pravidla

| Operace | Akce na cache |
|---------|--------------|
| CREATE | Invalidace všech list a search cache |
| UPDATE | Smazání konkrétního product:{id} + invalidace lists |
| DELETE | Smazání product:{id} + invalidace lists |

### Cache Service implementace

```typescript
class CacheService {
  // Získání dat z cache
  async get<T>(key: string): Promise<T | null>
  
  // Uložení dat do cache s TTL
  async set(key: string, value: any, ttl?: number): Promise<void>
  
  // Smazání konkrétního klíče
  async delete(key: string): Promise<void>
  
  // Smazání podle patternu (wildcard)
  async deletePattern(pattern: string): Promise<void>
  
  // Invalidace všech list/search cache
  async invalidateProductLists(): Promise<void>
  
  // Statistiky cache (hits, misses, hit rate)
  getStats(): CacheStats
}
```

### Product Service s cache integrací

```typescript
async getProductById(id: string) {
  // 1. Pokus o načtení z cache
  const cached = await cacheService.getProduct(id);
  if (cached) {
    return { data: cached, cache: { hit: true, source: 'redis' } };
  }
  
  // 2. Cache miss - načtení z databáze
  const product = await prisma.product.findUnique({ where: { id } });
  
  // 3. Uložení do cache pro příští požadavky
  await cacheService.setProduct(id, product);
  
  return { data: product, cache: { hit: false, source: 'database' } };
}
```

## Testování

### Manuální testování cache

#### Test 1: Cache Hit/Miss

```bash
# První request (očekává se Cache MISS)
curl http://localhost:5000/api/products/[ID]
# Response: "cache": {"hit": false, "source": "database"}

# Druhý request (očekává se Cache HIT)
curl http://localhost:5000/api/products/[ID]
# Response: "cache": {"hit": true, "source": "redis"}
```

#### Test 2: Cache invalidation

```bash
# Update produktu
curl -X PUT http://localhost:5000/api/products/[ID] \
  -H "Content-Type: application/json" \
  -d '{"price": 999.99}'

# Následující GET bude MISS (cache byla invalidována)
curl http://localhost:5000/api/products/[ID]
# Response: "cache": {"hit": false, "source": "database"}
```

#### Test 3: Vyhledávání

```bash
# První search (Cache MISS)
curl "http://localhost:5000/api/products?search=laptop"

# Druhý stejný search (Cache HIT)
curl "http://localhost:5000/api/products?search=laptop"
```

### Monitoring cache v RedisInsight

1. Otevřít http://localhost:8001
2. Připojit se k Redis databázi:
    - Host: `redis`
    - Port: `6379`
3. Prohlížet klíče v cache:
    - Browser sekce zobrazí všechny cached klíče
    - CLI pro manuální příkazy (GET, DEL, KEYS)

### Příkazy pro Redis CLI

```bash
# Připojení do Redis kontejneru
docker-compose exec redis redis-cli

# Zobrazení všech klíčů
KEYS *

# Získání konkrétního klíče
GET product:uuid-here

# Smazání klíče
DEL product:uuid-here

# Smazání podle patternu
KEYS products:list:* | xargs redis-cli DEL

# TTL klíče (zbývající čas)
TTL product:uuid-here

# Flush celé cache
FLUSHALL
```

## Výkonnostní metriky

### Očekávané hodnoty

- **Průměrná response time**:
    - Cache hit: ~15ms
    - Cache miss: ~150ms
    - Zrychlení: ~10x

- **Cache hit rate**: 85-95% (po zahřátí cache)

- **Database load reduction**: ~80% (většina readů jde z cache)

### Monitoring

- Cache statistiky dostupné na: `/api/cache/stats`
- Real-time dashboard na frontendu: `/stats`
- RedisInsight pro detailní analýzu: `http://localhost:8001`

## Environment Variables

### Backend (.env)

```bash
# Server konfigurace
PORT=5000
NODE_ENV=production

# Databázové připojení
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/productcatalog?schema=public"

# Redis připojení
REDIS_URL="redis://redis:6379"

# Cache TTL konfigurace (v sekundách)
CACHE_TTL_PRODUCT=600    # 10 minut
CACHE_TTL_LIST=300       # 5 minut
CACHE_TTL_SEARCH=180     # 3 minuty

# CORS nastavení
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```bash
# API endpoint
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Backend se neustále restartuje

```bash
# Zkontrolovat logy
docker-compose logs backend

# Nejčastější příčiny:
# - Databáze není připravená (wait longer)
# - Chybějící dependencies (rebuild image)
# - Port konflikt (změnit port v docker-compose.yml)
```

### Databáze neobsahuje data

```bash
# Ručně spustit seed
docker-compose exec backend npm run prisma:seed

# Nebo reset celé databáze
docker-compose down -v
docker-compose up -d
```

### Frontend se nenačte

```bash
# Zkontrolovat logy
docker-compose logs frontend

# Rebuild frontend image
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Redis connection failed

```bash
# Restart Redis
docker-compose restart redis

# Zkontrolovat Redis logs
docker-compose logs redis
```

## Závěr

Projekt demonstruje praktickou implementaci Redis cache vrstvy v reálné aplikaci s měřitelným přínosem pro výkon. Klíčové poznatky:

- Redis cache poskytuje 10x rychlejší read operace
- Automatická invalidace zajišťuje konzistenci dat
- Cache statistics umožňují monitoring a optimalizaci
- Docker orchestrace zjednodušuje deployment

## Autoři

- Backend & Redis implementace: [Jméno]
- Frontend & DevOps: [Jméno]

## License

MIT License - viz LICENSE soubor pro detaily.