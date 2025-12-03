# 🎬 Cine Diário

Aplicativo React Native para gerenciar seu catálogo pessoal de filmes e séries. Suporta armazenamento local (SQLite) e na nuvem (MongoDB), com integração à API do **The Movie Database (TMDB)**.

---

## 📋 Índice

- [Características](#-características-principais)
- [Tecnologias](#-tecnologias-utilizadas)
- [Quick Start](#-quick-start)
- [Instalação Detalhada](#-instalação-detalhada)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API REST](#-api-rest)
- [TMDB Integration](#-integração-tmdb)
- [Troubleshooting](#-troubleshooting)
- [Checklist](#-checklist-de-setup)

---

## 🎯 Características Principais

✅ **Tela de Splash** - Animação inicial do aplicativo  
✅ **Seleção de Banco de Dados** - Escolha entre SQLite (offline) ou MongoDB (nuvem)  
✅ **CRUD Completo** - Criar, Ler, Atualizar e Deletar produções  
✅ **Busca TMDB** - Pesquise filmes e séries na API do The Movie Database  
✅ **Filtros** - Filtrar por tipo (Filme/Série) e exibir estatísticas  
✅ **Design Responsivo** - Interface moderna com tema escuro  
✅ **Campos Personalizados** - Título, Ano, Gênero, Tipo, Nota, Plataforma, Resumo  

---

## 📱 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React Native | 0.74.5 | Framework mobile |
| Expo | SDK 51 | Plataforma de desenvolvimento |
| TypeScript | 5.3+ | Tipagem estática |
| StyleSheet | - | Estilização nativa |

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | 14+ | Runtime JavaScript |
| Express | 4.18+ | Framework web |
| MongoDB | - | Banco NoSQL |
| Mongoose | 7.5+ | ODM para MongoDB |

### APIs Externas
| API | Uso |
|-----|-----|
| TMDB | Busca de filmes/séries, posters, informações |

### Storage Local
| Tecnologia | Descrição |
|------------|-----------|
| expo-sqlite | Banco de dados local |

---

## 🚀 Quick Start

### 1. Instalar Dependências
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Iniciar Backend (se usar MongoDB)
```bash
cd backend
cp .env.example .env  # Configure com suas credenciais
npm run dev
```

### 3. Iniciar App
```bash
npm start
# Escaneie o QR code com Expo Go
```

---

## 📦 Instalação Detalhada

### Pré-requisitos

```bash
# Verificar Node.js
node --version  # v14+

# Verificar npm
npm --version   # v6+
```

### Setup Frontend

```bash
cd CineDiario
npm install
```

**Opções de execução:**

```bash
# Expo Go (Recomendado)
npm start

# Android Emulator
npm run android

# iOS Simulator
npm run ios

# Web Browser
npm run web
```

### Setup Backend + MongoDB

#### Opção A: MongoDB Atlas (Nuvem - Recomendado)

1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie conta gratuita e um cluster (Free M0)
3. Copie a connection string
4. Configure em `backend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/cine-diario
PORT=3000
NODE_ENV=development
```

#### Opção B: MongoDB Local

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Iniciar Backend

```bash
cd backend
npm run dev
# ✅ Conectado ao MongoDB com sucesso!
# 🚀 Servidor rodando em http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
CineDiario/
├── App.tsx                    # Componente raiz com navegação
├── app.json                   # Configuração Expo
├── package.json               # Dependências frontend
├── tsconfig.json              # Configuração TypeScript
│
├── src/
│   ├── screens/               # Telas da aplicação
│   │   ├── SplashScreen.tsx           # Tela inicial (3s)
│   │   ├── DatabaseSelectionScreen.tsx # Seleção SQLite/MongoDB
│   │   ├── HomeScreen.tsx             # Listagem + filtros
│   │   ├── AddMovieScreen.tsx         # Adicionar produção
│   │   ├── EditMovieScreen.tsx        # Editar produção
│   │   └── SearchTMDBScreen.tsx       # Buscar no TMDB
│   │
│   ├── contexts/
│   │   └── DatabaseContext.tsx  # Contexto do banco de dados
│   │
│   ├── services/
│   │   ├── sqliteService.ts     # CRUD SQLite
│   │   ├── mongoService.ts      # CRUD MongoDB
│   │   └── tmdbService.ts       # API The Movie Database
│   │
│   ├── types/
│   │   └── Production.ts        # Interface Production
│   │
│   └── utils/
│       └── uuid.ts              # Gerador de IDs
│
└── backend/
    ├── package.json
    ├── .env.example
    └── src/
        ├── server.js            # Express server
        ├── models/
        │   └── Production.js    # Schema Mongoose
        └── routes/
            └── productions.js   # Endpoints CRUD
```

---

## 🎬 Entidade Production

```typescript
interface Production {
  id: string;
  titulo: string;                    // Título do filme/série
  anoLancamento: number;             // Ano de lançamento
  genero: string;                    // Gênero (Ação, Drama, etc)
  tipo: 'filme' | 'série';          // Tipo de produção
  minhaNotas: number;                // Avaliação pessoal (0-10)
  ondeAssistiu: string;              // Plataforma (Netflix, Cinema, etc)
  posterUrl?: string;                // URL do poster (TMDB)
  resumo?: string;                   // Resumo ou impressões
  dateCriacao?: string;              // Data de criação
  dataAtualizacao?: string;          // Última atualização
}
```

---

## 📊 API REST

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/productions` | Listar todas |
| GET | `/api/productions/:id` | Obter uma |
| POST | `/api/productions` | Criar nova |
| PUT | `/api/productions/:id` | Atualizar |
| DELETE | `/api/productions/:id` | Deletar |
| GET | `/api/productions/type/:type` | Por tipo |
| GET | `/api/productions/genre/:genre` | Por gênero |
| GET | `/api/productions/platform/:p` | Por plataforma |

### Exemplos de Requisições

**Criar produção:**
```http
POST http://localhost:3000/api/productions
Content-Type: application/json

{
  "titulo": "Oppenheimer",
  "anoLancamento": 2023,
  "genero": "Drama",
  "tipo": "filme",
  "minhaNotas": 9,
  "ondeAssistiu": "Cinema",
  "resumo": "Filme extraordinário sobre J. Robert Oppenheimer"
}
```

**Listar todas:**
```http
GET http://localhost:3000/api/productions
```

**Atualizar:**
```http
PUT http://localhost:3000/api/productions/{id}
Content-Type: application/json

{
  "minhaNotas": 10
}
```

**Deletar:**
```http
DELETE http://localhost:3000/api/productions/{id}
```

---

## 🎥 Integração TMDB

O app possui integração completa com a API do **The Movie Database (TMDB)**.

### Funcionalidades TMDB

- 🔍 Busca de filmes e séries por nome
- 📈 Listagem de populares e mais bem avaliados
- 🖼️ Posters e imagens em alta qualidade
- 🌐 Informações em português (pt-BR)
- ➕ Adicionar à coleção pessoal com um toque

### Como Usar

1. Na tela inicial, clique no botão **"🔍 TMDB"**
2. Pesquise por nome ou navegue nos populares
3. Alterne entre **Filmes** e **Séries**
4. Clique em um resultado para adicionar
5. Escolha onde assistiu e sua nota
6. Salve na sua coleção!

---

## 📱 Fluxo da Aplicação

```
┌─────────────────────┐
│    Splash Screen    │
│  (Logo + 3 segundos)│
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Database Selection  │
│ [SQLite] [MongoDB]  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│    Home Screen      │
│ ┌─────────────────┐ │
│ │ Cine Diário 🔍  │ │
│ │ Filtros: Todos  │ │
│ ├─────────────────┤ │
│ │ 🎬 Oppenheimer  │ │
│ │ ★ 9/10 | Drama  │ │
│ │ [Editar][Deletar│ │
│ └─────────────────┘ │
│         ➕          │
└─────────────────────┘
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "EADDRINUSE: address already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :3000
kill -9 {PID}
```

### Erro: "Cannot connect to MongoDB"
```bash
# Verifique se MongoDB está rodando
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Expo não conecta ao backend
Use seu IP local em vez de localhost:
```typescript
// mongoService.ts
const API_URL = 'http://192.168.x.x:3000/api';
```

Para descobrir seu IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### Debug e Logs

**Backend:**
```bash
cd backend
npm run dev
# Logs aparecem no terminal
```

**Frontend:**
- Android/iOS: Shake device → Menu de debug
- Web: F12 → Console

---

## ✅ Checklist de Setup

- [ ] Node.js instalado (v14+)
- [ ] Dependências frontend instaladas (`npm install`)
- [ ] Dependências backend instaladas (`cd backend && npm install`)
- [ ] MongoDB configurado (local ou Atlas)
- [ ] `.env` configurado no backend
- [ ] Backend iniciado (`npm run dev`)
- [ ] Frontend iniciado (`npm start`)
- [ ] App testado no Expo Go
- [ ] CRUD funcionando
- [ ] Busca TMDB funcionando

---

## 🎨 Design

**Tema:** Dark Mode (Cinza + Vermelho)

**Cores:**
| Cor | Hex | Uso |
|-----|-----|-----|
| Vermelho | #DC2626 | Primária, botões |
| Azul | #2563EB | Editar |
| Amarelo | #FBBF24 | Estrelas/Rating |
| Cinza Escuro | #111827 | Background |
| Cinza | #1F2937 | Cards |

---

## 🗄️ Estrutura SQLite

```sql
CREATE TABLE productions (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  anoLancamento INTEGER NOT NULL,
  genero TEXT NOT NULL,
  tipo TEXT NOT NULL,
  minhaNotas INTEGER NOT NULL,
  ondeAssistiu TEXT NOT NULL,
  posterUrl TEXT,
  resumo TEXT,
  dateCriacao TEXT NOT NULL,
  dataAtualizacao TEXT NOT NULL
)
```

---

## 📚 Recursos Úteis

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [TMDB API Docs](https://developers.themoviedb.org/3)

---

## 📝 Licença

MIT

---

## 👨‍💻 Autor

Projeto desenvolvido como trabalho acadêmico - FATEC 5º Semestre - PPDM II

---

**Aproveite seu catálogo de filmes! 🎬🍿**
