#!/bin/bash
# Script de setup automático (opcional)

echo "🎬 Catálogo de Filmes - Setup Automático"
echo "=========================================="
echo ""

# Verificar Node.js
echo "📝 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version) encontrado"

# Verificar npm
echo "📝 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado"
    exit 1
fi
echo "✅ npm $(npm --version) encontrado"

echo ""
echo "📦 Instalando dependências..."

# Instalar dependências frontend
echo "  • Frontend..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências frontend"
    exit 1
fi
echo "  ✅ Frontend instalado"

# Instalar dependências backend
echo "  • Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências backend"
    exit 1
fi
cd ..
echo "  ✅ Backend instalado"

# Configurar .env
echo ""
echo "⚙️  Configurando ambiente..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "  📝 Arquivo .env criado"
    echo "  ⚠️  IMPORTANTE: Edite backend/.env com sua MongoDB URI"
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📖 Próximos passos:"
echo "  1. Edite backend/.env com sua MongoDB URI"
echo "  2. Inicie o backend: cd backend && npm run dev"
echo "  3. Inicie o frontend: npm start"
echo ""
echo "Acesse START_HERE.md para mais detalhes"
