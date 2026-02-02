#!/bin/bash
# ============================================
# genOS - Script de Deploy Completo
# Execute com: bash deploy.sh
# ============================================

set -e  # Exit on error

echo "============================================"
echo "       genOS - Deploy Automation"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo -e "${BLUE}📁 Diretório do projeto:${NC} $PROJECT_DIR"
echo ""

# ============================================
# STEP 1: Git Status & Commit
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 STEP 1: Git Commit & Push${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if git repo
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Não é um repositório Git!${NC}"
    echo "Inicializando git..."
    git init
    git remote add origin https://github.com/user/genos.git 2>/dev/null || true
fi

# Show status
echo "📋 Status atual:"
git status --short

# Add all changes
echo ""
echo "➕ Adicionando alterações..."
git add -A

# Commit
COMMIT_MSG="feat: genOS Carbon AI - Complete implementation

- Carbon Design System v11 integration
- Carbon for AI components (AILabel, AIPopover)
- Carbon Charts (LineChart, DonutChart)
- UI Shell (Header, Sidebar, AppShell)
- Command Palette (⌘K)
- 10 pages: Dashboard, Clients, Projects, Briefings, Documents, Helian, Analytics, Settings, Notifications, Login
- Advanced DataTables with batch actions
- Kanban board with drag-and-drop
- Timeline view
- Progressive authentication
- Dark/Light mode
- AI Insights system
- Helian AI Chat interface
- Responsive design
- Supabase integration

Total: ~16,600 lines of code"

echo ""
echo "💾 Fazendo commit..."
git commit -m "$COMMIT_MSG" || echo "Nada para commitar"

# Push
echo ""
echo "🚀 Fazendo push para origin..."
git push origin main || git push origin master || {
    echo -e "${YELLOW}⚠️  Push falhou. Verifique suas credenciais do GitHub.${NC}"
    echo "Você pode fazer manualmente: git push origin main"
}

echo ""
echo -e "${GREEN}✅ Git concluído!${NC}"

# ============================================
# STEP 2: Build Verification
# ============================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔨 STEP 2: Build Verification${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "🔍 Verificando build..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build passou!${NC}"
else
    echo -e "${RED}❌ Build falhou! Corrija os erros antes de continuar.${NC}"
    exit 1
fi

# ============================================
# STEP 3: Vercel Deploy
# ============================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🌐 STEP 3: Vercel Deploy${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "🔗 Projeto não está linkado ao Vercel."
    echo "Execute: vercel link"
    echo ""
    vercel link
fi

# Deploy to production
echo ""
echo "🚀 Fazendo deploy para produção..."
vercel --prod

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"

# ============================================
# STEP 4: Environment Variables Check
# ============================================
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔐 STEP 4: Environment Variables${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "⚠️  Verifique se as seguintes variáveis estão configuradas no Vercel:"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]"
echo ""
echo "Para configurar, execute:"
echo "   vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""

# ============================================
# SUMMARY
# ============================================
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}       🎉 DEPLOY CONCLUÍDO!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "📋 Próximos passos manuais:"
echo ""
echo "1. Configure as variáveis de ambiente no Vercel (se ainda não fez)"
echo "2. Crie um usuário no Supabase Auth:"
echo "   - Email: mail@cestari.studio"
echo "   - Vá em Authentication > Users > Add User"
echo ""
echo "3. Acesse sua aplicação e teste o login"
echo ""
echo -e "${BLUE}🔗 Vercel Dashboard: https://vercel.com/dashboard${NC}"
echo -e "${BLUE}🔗 Supabase Dashboard: https://supabase.com/dashboard${NC}"
echo ""
