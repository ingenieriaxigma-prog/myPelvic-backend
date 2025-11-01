# MyPelvic Backend (NestJS + Supabase + Docker)

Este backend fue desarrollado con **NestJS**, **Supabase** y **Docker**, siguiendo principios de arquitectura modular y escalabilidad.  
Incluye autenticación real con validación por correo electrónico y documentación automática con **Swagger**.

---

## Tecnologías principales

- **NestJS** → Framework modular para Node.js  
- **Supabase** → Base de datos PostgreSQL + autenticación  
- **Docker** → Entorno de ejecución reproducible  
- **Swagger** → Documentación y pruebas de endpoints  
- **TypeScript** → Tipado fuerte y limpio  

---

## Arquitectura del Backend — MyPelvic

```mermaid
flowchart TD
A[Usuario / App / Swagger] -->|POST /auth/signup, POST /auth/login| B[AuthController]
B -->|Valida datos con DTOs (email, password)| C[AuthService]
C -->|Usa cliente Supabase| D[SupabaseClientProvider]
D -->|Conecta con claves .env| E[Supabase Cloud]
E -->|Guarda usuarios y gestiona autenticación| F[Base de Datos PostgreSQL]
F -->|Devuelve resultado JSON| G[Respuesta HTTP]

subgraph NestJS_App [NestJS Application]
direction TB
H[main.ts - Punto de arranque] --> I[AppModule - Módulo raíz]
I --> J[AuthModule - Módulo de autenticación]
J --> B
J --> C
J --> D
end

subgraph Supabase [Supabase Cloud]
direction TB
E
F
end
```
## 🔐 Módulo de Autenticación (AuthModule)

Gestiona el **registro**, **login** y **verificación de sesión** usando Supabase Auth.  
Cada usuario se autentica mediante correo electrónico y contraseña, y recibe un token **JWT** automático.

### Endpoints principales

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| **POST** | `/auth/signup` | Registro de usuario (correo + contraseña) |
| **POST** | `/auth/login` | Inicio de sesión |
| **GET** | `/auth/profile` | Verificación del perfil autenticado |

---

## 👥 Módulo de Usuarios (UserModule)

Permite a los usuarios autenticados consultar y actualizar su perfil, y al administrador listar todos los usuarios.

### 📁 Estructura

```
src/modules/user/
├── dto/
│   ├── update-user.dto.ts
│   └── user-response.dto.ts
├── entities/
│   └── user.entity.ts
├── user.controller.ts
├── user.service.ts
└── user.module.ts
```

### Endpoints

| Método | Endpoint | Descripción | Rol |
|--------|-----------|-------------|-----|
| **GET** | `/users/me` | Devuelve el perfil del usuario actual | autenticado |
| **PATCH** | `/users/me` | Actualiza el perfil (nombre, teléfono, avatar) | autenticado |
| **DELETE** | `/users/me` | Elimina la cuenta actual | autenticado |
| **GET** | `/users` | Lista todos los usuarios | admin |

### 🧩 Ejemplo de PATCH `/users/me`

```json
{
  "full_name": "Fabián González",
  "phone": "+573208635546",
  "avatar_url": "https://cdn.mypelvic.com/avatars/fabian.png"
}
```

---

## 💬 Módulo Feed (Publicaciones y Comentarios)

El **FeedModule** permite que los usuarios autenticados creen, editen y eliminen publicaciones, además de comentar e interactuar dentro de la comunidad MyPelvic.

### 📁 Estructura

```
src/modules/feed/
├── dto/
│   ├── create-post.dto.ts
│   ├── update-post.dto.ts
│   ├── create-comment.dto.ts
├── entities/
│   ├── post.entity.ts
│   └── comment.entity.ts
├── feed.controller.ts
├── feed.service.ts
└── feed.module.ts
```

---

## 📊 Tablas en Supabase

### Tabla `posts`

```sql
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users (id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Tabla `comments`

```sql
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  text text not null,
  created_at timestamp with time zone default now()
);
```

---

## ⚙️ Endpoints del Feed

| Método | Endpoint | Descripción | Rol |
|--------|-----------|-------------|-----|
| **POST** | `/feed/posts` | Crear una nueva publicación | autenticado |
| **GET** | `/feed/posts` | Listar todas las publicaciones | autenticado |
| **PATCH** | `/feed/posts/:id` | Actualizar publicación propia | autor |
| **DELETE** | `/feed/posts/:id` | Eliminar publicación | autor / admin |
| **POST** | `/feed/comments` | Agregar comentario a una publicación | autenticado |
| **GET** | `/feed/comments/:postId` | Listar comentarios de una publicación | autenticado |

---

## 🧠 Ejemplos

### Crear publicación

```json
{
  "content": "Hoy hice mi primer ejercicio de Kegel 💪",
  "image_url": "https://mypelvic.com/uploads/ejercicio1.jpg"
}
```

### Crear comentario

```json
{
  "text": "Excelente publicación 💫",
  "post_id": "f9d40cc5-bf79-44e8-bfa3-2e9b12c1e2f7"
}
```

---

## 💡 Notas técnicas

- Todos los endpoints usan `SupabaseAuthGuard`.
- Los tokens JWT son gestionados directamente por Supabase.
- Los timestamps (`created_at`, `updated_at`) se actualizan con triggers SQL.
- Arquitectura **100% modular** y **escalable**.
- Preparado para futuras ampliaciones como **Likes**, **Notificaciones** y **Chat en tiempo real**.

---

## 🧭 Próximos módulos

1. **ChatModule** → Mensajería en tiempo real con Redis + WebSockets  
2. **GamificationModule** → Puntos y logros por participación  
3. **AIInsightsModule** → Sugerencias automáticas desde IA médica  

---

## 🚀 Cómo ejecutar el proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/ingenieriaxigma-prog/mypelvic-backend.git
cd mypelvic-backend
```

### 2️⃣ Crear archivo `.env`

```bash
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_KEY=eyJhbGciOiJI...
PORT=3000
```

### 3️⃣ Levantar el entorno con Docker o local

```bash
docker compose up --build
```
```bash
npm run start:dev
```
### 4️⃣ Acceder a Swagger

Abrir en el navegador:  
👉 `http://localhost:3000/api/docs`
    `http://localhost:3000/docs`

---

## ✨ Créditos

Proyecto desarrollado por **Fabián González** y el equipo de **MyPelvic AI**.  
Inspirado en la visión de empoderar la salud íntima con tecnología e inteligencia artificial 💜.

---

## 🧩 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.  
Eres libre de usar, modificar y compartir, siempre dando crédito a los autores originales.
