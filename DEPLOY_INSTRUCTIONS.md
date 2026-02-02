# 🚀 genOS - Instruções de Deploy para Claude Code

## Copie e cole este prompt no Claude Code:

---

```
Execute o deploy completo do projeto genOS seguindo estas etapas:

## 1. LOCALIZAÇÃO DO PROJETO
O projeto está em: /home/claude/genOS-9df2becd2fec513556ea6e89a456b34e50abdba7

## 2. GIT - COMMIT E PUSH
- Navegue até o diretório do projeto
- Execute: git add -A
- Faça commit com mensagem: "feat: genOS Carbon AI - Complete implementation with 16k+ lines"
- Push para o repositório: git push origin main

## 3. VERCEL - DEPLOY
- Verifique se o Vercel CLI está instalado: vercel --version
- Se não estiver, instale: npm install -g vercel
- Link o projeto se necessário: vercel link
- Deploy para produção: vercel --prod
- Configure as environment variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

## 4. SUPABASE - CRIAR USUÁRIO
No Supabase Dashboard (https://supabase.com/dashboard):
- Vá em Authentication > Users
- Clique em "Add User" > "Create New User"
- Email: mail@cestari.studio
- Password: [DEFINIR]
- Marque "Auto Confirm User"

## 5. VERIFICAÇÃO
- Acesse a URL de produção do Vercel
- Teste o login com o usuário criado
- Navegue pelas páginas principais

Se precisar das credenciais do Supabase, elas estão em:
/home/claude/genOS-9df2becd2fec513556ea6e89a456b34e50abdba7/src/lib/supabase/client.ts
```

---

## 📋 Checklist Manual (se preferir fazer você mesmo):

### Git
```bash
cd /home/claude/genOS-9df2becd2fec513556ea6e89a456b34e50abdba7
git add -A
git commit -m "feat: genOS Carbon AI - Complete implementation"
git push origin main
```

### Vercel
```bash
# Instalar CLI (se necessário)
npm install -g vercel

# Login
vercel login

# Link projeto
vercel link

# Deploy
vercel --prod

# Configurar variáveis
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Supabase (via Dashboard)
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** > **Users**
4. Clique **Add User** > **Create New User**
5. Preencha:
   - Email: `mail@cestari.studio`
   - Password: `[sua senha]`
   - ✅ Auto Confirm User
6. Clique **Create User**

---

## 🔑 Variáveis de Ambiente Necessárias:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[SEU_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
```

Para encontrar essas informações:
1. Acesse o Supabase Dashboard
2. Vá em **Settings** > **API**
3. Copie a **Project URL** e a **anon public** key

---

## 📊 O que foi implementado:

- ✅ 10 páginas completas
- ✅ ~16,600 linhas de código
- ✅ Carbon Design System v11
- ✅ Carbon for AI
- ✅ Carbon Charts
- ✅ Autenticação Supabase
- ✅ Dark/Light mode
- ✅ Kanban drag-and-drop
- ✅ AI Insights
- ✅ Helian Chat
- ✅ Responsive design

---

## 🆘 Problemas Comuns:

### "Permission denied" no git push
```bash
# Configure suas credenciais
git config --global user.email "mail@cestari.studio"
git config --global user.name "Octavio Cestari"
# Use token de acesso pessoal do GitHub como senha
```

### Vercel não encontra o projeto
```bash
vercel link
# Selecione "Link to existing project" ou "Create new project"
```

### Build falha no Vercel
- Verifique se as variáveis de ambiente estão configuradas
- Confira se o Node version está correto (18.x)

---

Boa sorte com o deploy! 🎉
