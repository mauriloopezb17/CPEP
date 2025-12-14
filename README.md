# CPEP - Constitución Política del Estado (Reader & AI Assistant)

Una aplicación moderna y accesible para navegar, leer y consultar la Constitución Política del Estado Plurinacional de Bolivia. Integra un asistente de IA avanzado (RAG) que responde preguntas jurídicas con citas precisas a los artículos correspondientes.

## Características Principales

### Explorador de la Constitución
- **Feed Interactivo**: Lectura fluida de artículos, introducciones y disposiciones.
- **Navegación Intuitiva**: Sidebar organizado jerárquicamente por Partes, Títulos y Capítulos.
- **Modos de Lectura**:
  - Modo Claro
  - Modo Oscuro (OLED friendly)
  - Eye Care (Tono sepia suave para lectura prolongada)
- **Ajuste de Texto**: Control de tamaño de fuente.

### Asistente Legal con IA (RAG)
- **Consultas Naturales**: Pregunta sobre cualquier tema legal en lenguaje natural.
- **Citas de Fuentes**: Cada respuesta incluye botones directos a los artículos, introducciones o disposiciones consultadas.
- **Respuestas Contextuales**: La IA utiliza el contexto de la conversación para dar respuestas más precisas.
- **Experiencia de Usuario**:
  - Efecto de escritura progresiva (Typewriter).
  - Manejo de errores amigable (límites de cuota, filtros de seguridad).
  - Historial de chat en sesión.

## Tecnologías

### Frontend
- **React**: Framework UI principal.
- **Tailwind CSS**: Estilizado moderno y responsivo.
- **Vite**: Build tool rápido y ligero.
- **Lucide React**: Iconografía consistente.

### Backend
- **FastAPI**: API REST de alto rendimiento.
- **Google GenAI / Gemini**: Modelo de lenguaje (LLM).
- **LangChain / RAG**: Lógica de recuperación y generación aumentada.
- **ChromaDB / Vector Store** (Implícito en la lógica RAG): Búsqueda semántica.

## Configuración y Ejecución

### Prerrequisitos
- Node.js (v18+)
- Python (v3.10+)
- Google API Key (para el servicio de IA)

### 1. Backend (API)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Renombrar .env.example a .env y agregar tu GOOGLE_API_KEY
cp .env.example .env

# Ejecutar servidor
python run.py
# O directamente: uvicorn app.main:app --reload
```

El servidor correrá en `http://localhost:8000`.

### 2. Frontend (Cliente)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Estructura del Proyecto

- `/backend`: API FastAPI, lógica RAG, esquemas Pydantic.
- `/frontend`: SPA React, componentes UI (AIPanel, Sidebar, Feed), servicios.
- `/data`: Archivos fuente de la constitución (JSON/PDF).
