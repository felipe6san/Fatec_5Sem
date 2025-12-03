# Backend - Catálogo de Filmes

Servidor Node.js com Express para o aplicativo de catálogo de filmes, utilizando MongoDB.

## 🚀 Início Rápido

Para instruções detalhadas de instalação, veja [../SETUP.md](../SETUP.md)

### Instalação de Dependências
```bash
npm install
```

### Configuração do Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

Edit o `.env` conforme necessário:

**MongoDB Local:**
```
MONGODB_URI=mongodb://localhost:27017/catalogo-filmes
PORT=3000
NODE_ENV=development
```

**MongoDB Atlas (Nuvem):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catalogo-filmes?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

### Executar o Servidor

Desenvolvimento (com hot reload):
```bash
npm run dev
```

Produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📊 Banco de Dados - MongoDB

### Coleção: productions

```json
{
  "_id": "ObjectId",
  "titulo": "string",
  "anoLancamento": "number",
  "genero": "string",
  "tipo": "string (filme | série)",
  "minhaNotas": "number (0-10)",
  "ondeAssistiu": "string",
  "posterUrl": "string (opcional)",
  "resumo": "string (opcional)",
  "dateCriacao": "Date",
  "dataAtualizacao": "Date"
}
```

## 🔌 Endpoints da API

### Produções

#### Create
```
POST /api/productions
Content-Type: application/json

{
  "titulo": "Oppenheimer",
  "anoLancamento": 2023,
  "genero": "Drama",
  "tipo": "filme",
  "minhaNotas": 9,
  "ondeAssistiu": "Cinema",
  "resumo": "Ótimo filme!"
}
```

#### Read All
```
GET /api/productions
```

#### Read One
```
GET /api/productions/:id
```

#### Read by Type
```
GET /api/productions/type/filme
GET /api/productions/type/série
```

#### Read by Genre
```
GET /api/productions/genre/Drama
```

#### Read by Platform
```
GET /api/productions/platform/Netflix
```

#### Update
```
PUT /api/productions/:id
Content-Type: application/json

{
  "minhaNotas": 10,
  "resumo": "Ainda melhor na segunda assistida!"
}
```

#### Delete
```
DELETE /api/productions/:id
```

#### Health Check
```
GET /api/health
```

## 🗄️ Setup MongoDB

### MongoDB Local

#### 1. Instalar MongoDB Community

- **Windows**: [Download e instalar](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: [Documentação oficial](https://docs.mongodb.com/manual/administration/install-on-linux/)

#### 2. Iniciar MongoDB

**Windows (PowerShell como Admin):**
```bash
net start MongoDB
# ou
mongod --dbpath "C:\data\db"
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# ou
mongod
```

### MongoDB Atlas (Cloud - Recomendado)

1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Configure um cluster (opção Free M0)
4. Obtenha a connection string: `mongodb+srv://...`
5. Adicione em `.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catalogo-filmes?retryWrites=true&w=majority
```

## 📦 Dependências

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **cors** - Middleware CORS
- **dotenv** - Variáveis de ambiente
- **body-parser** - Parse de request bodies

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia com nodemon (desenvolvimento)
- `npm test` - Executa testes (quando adicionados)

## 📝 Estrutura

```
backend/
├── src/
│   ├── models/
│   │   └── Production.js       # Schema do Mongoose
│   ├── routes/
│   │   └── productions.js      # Rotas da API
│   └── server.js               # Configuração do servidor
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Notas de Segurança

- Nunca exponha suas credenciais do MongoDB
- Use `.env` para variáveis sensíveis
- Implemente autenticação/autorização conforme necessário
- Valide todas as entradas do cliente

## 🐛 Troubleshooting

### Erro: "connect ECONNREFUSED"
- Verifique se MongoDB está rodando
- Confira a `MONGODB_URI` em `.env`

### Erro: "Cannot find module"
- Rode `npm install` novamente
- Delete `node_modules` e `package-lock.json`, depois execute `npm install`

### CORS não funcionando
- O CORS está habilitado para todas as origens
- Modifique `cors()` em `server.js` se necessário

---

**Desenvolvido para o Catálogo de Filmes** 🎬
