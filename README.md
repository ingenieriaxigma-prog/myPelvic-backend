# 🧠 MyPelvic Backend (NestJS + Supabase + Docker)

Este backend fue desarrollado con **NestJS**, **Supabase** y **Docker**, siguiendo principios de arquitectura modular.  
Incluye autenticación real con validación por correo electrónico y documentación automática con Swagger.

---

### 🧱 Tecnologías principales
- **NestJS** → framework modular para Node.js  
- **Supabase** → base de datos PostgreSQL + autenticación  
- **Docker** → entorno de ejecución reproducible  
- **Swagger** → documentación y pruebas de endpoints  
- **TypeScript** → tipado fuerte y limpio  

---

## 🧠 Arquitectura del Backend — MyPelvic

```mermaid
flowchart TD
    A[Usuario / App / Swagger] -->|"POST /auth/signup"| B[AuthController]
    A -->|"POST /auth/login"| B
    B -->|"Valida datos con DTOs (email, password)"| C[AuthService]
    C -->|"Usa cliente Supabase"| D[SupabaseClientProvider]
    D -->|"Conecta con claves .env"| E[Supabase Cloud]
    E -->|"Guarda usuarios y gestiona autenticación"| F[Base de Datos PostgreSQL]
    F -->|"Devuelve resultado JSON"| G[Respuesta HTTP]
    
    %% Estructura de módulos
    subgraph NestJS_App [NestJS Application]
        direction TB
        H[main.ts - Punto de arranque] --> I[AppModule - Módulo raíz]
        I --> J[AuthModule - Módulo de autenticación]
        J --> B
        J --> C
        J --> D
    end

    %% Relaciones externas
    subgraph Supabase [Supabase Cloud]
        direction TB
        E
        F
    end

    %% Estilos
    style NestJS_App fill:#E7F1FF,stroke:#6FA8DC,stroke-width:2px
    style Supabase fill:#FFF7E6,stroke:#F4A261,stroke-width:2px

---

## 👥 MÓDULO DE USUARIOS (`UserModule`)

### 📘 Descripción general
El módulo de usuarios permite la gestión completa de perfiles dentro del ecosistema **MyPelvic API**, enlazando los registros de **Supabase Auth** con la tabla `public.users`.  
Cada usuario que se registra o inicia sesión se sincroniza automáticamente mediante un **trigger SQL**, garantizando consistencia entre ambas fuentes.

### ⚙️ Estructura de carpetas
src/
└── modules/
└── user/
├── dto/
│ ├── update-user.dto.ts
│ └── user-response.dto.ts
├── entities/
│ └── user.entity.ts
├── user.controller.ts
├── user.service.ts
└── user.module.ts


---

### 🧩 Funcionalidades principales

| Método | Endpoint       | Descripción |
|--------|----------------|-------------|
| `GET`  | `/users/me`    | Retorna el perfil del usuario autenticado. |
| `PATCH`| `/users/me`    | Permite actualizar datos básicos como nombre, teléfono o avatar. |
| `DELETE`| `/users/me`   | Elimina la cuenta del usuario autenticado. |
| `GET`  | `/users`       | Lista todos los usuarios (solo disponible para roles `admin`). |

---

### 🔒 Autenticación

Todas las rutas están protegidas mediante el **SupabaseAuthGuard**, que valida el token JWT recibido desde Supabase.

Ejemplo de header en Postman o Swagger:

```bash
Authorization: Bearer <tu_access_token>
