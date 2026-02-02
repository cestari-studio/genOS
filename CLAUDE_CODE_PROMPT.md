# 🚀 PROMPT PARA CLAUDE CODE - COPIE E COLE

---

Faça o deploy completo do genOS:

**Projeto:** /home/claude/genOS-9df2becd2fec513556ea6e89a456b34e50abdba7

**Tarefas:**

1. **Git** - Commit todas as alterações e push para GitHub (origin main)

2. **Vercel** - Deploy para produção e configure as env vars:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. **Supabase** - Crie usuário no Auth:
   - Email: mail@cestari.studio
   - Senha: CestariStudio2024!
   - Auto confirm: sim

4. **Verificar** - Acesse a URL de produção e teste o login

O projeto usa schema 'cestari' no Supabase. As tabelas já devem existir (clients, projects, briefings, documents).

---

# OU USE O SCRIPT AUTOMATIZADO:

```bash
cd /home/claude/genOS-9df2becd2fec513556ea6e89a456b34e50abdba7
chmod +x deploy.sh
./deploy.sh
```
