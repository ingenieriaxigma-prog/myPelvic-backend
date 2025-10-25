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
    A[🧍‍♂️ Usuario / App / Swagger] -->|POST /auth/signup<br/>POST /auth/login| B[🎯 AuthController]
    B -->|Valida datos con DTOs<br/>(email, password)| C[⚙️ AuthService]
    C -->|Usa cliente Supabase| D[🔌 SupabaseClientProvider]
    D -->|Conecta con claves .env| E[☁️ Supabase Cloud]
    E -->|Guarda usuarios<br/>y gestiona autenticación| F[💾 Base de Datos PostgreSQL]
    F -->|Devuelve resultado JSON| G[📬 Respuesta HTTP]
    
    %% Estructura de módulos
    subgraph NestJS App [🏗️ NestJS Application]
        direction TB
        H[🧩 main.ts<br/>Punto de arranque] --> I[🏠 AppModule<br/>Módulo raíz]
        I --> J[🔐 AuthModule<br/>Módulo de autenticación]
        J --> B
        J --> C
        J --> D
    end

    %% Relaciones externas
    subgraph Supabase [☁️ Supabase Cloud]
        direction TB
        E
        F
    end

    %% Estilo
    style NestJS App fill:#E7F1FF,stroke:#6FA8DC,stroke-width:2px
    style Supabase fill:#FFF7E6,stroke:#F4A261,stroke-width:2px
