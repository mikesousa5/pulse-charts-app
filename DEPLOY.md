# Deploy no Netlify - Guia Passo a Passo

Este guia irá ajudá-lo a fazer o deploy do **FitTrack** no Netlify.

## 📋 Pré-requisitos

1. Conta no [Netlify](https://app.netlify.com)
2. Conta no [Supabase](https://supabase.com)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🚀 Opção 1: Deploy via Interface do Netlify (Recomendado)

### Passo 1: Preparar o Repositório

1. Certifique-se de que o código está no GitHub/GitLab/Bitbucket
2. Verifique se o `.env` **NÃO** está commitado (deve estar no .gitignore)
3. Push do código para o repositório remoto:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### Passo 2: Criar Site no Netlify

1. Acesse [https://app.netlify.com](https://app.netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Selecione seu provedor Git (GitHub, GitLab, Bitbucket)
4. Autorize o Netlify a acessar seus repositórios
5. Selecione o repositório **pulse-charts-app**

### Passo 3: Configurar Build Settings

O Netlify detectará automaticamente as configurações do `netlify.toml`, mas confirme:

- **Base directory:** (deixe em branco)
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18

### Passo 4: Configurar Variáveis de Ambiente

**IMPORTANTE:** Configure as variáveis de ambiente antes do primeiro deploy!

1. No painel do Netlify, vá para **Site settings** → **Environment variables**
2. Clique em **"Add a variable"** e adicione:

| Key | Value | Exemplo |
|-----|-------|---------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública do Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto Supabase | `xxxxx` |

**Onde encontrar essas informações:**
- Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
- Vá para **Project Settings** → **API**
- Copie:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **Project API keys** → **anon/public** → `VITE_SUPABASE_PUBLISHABLE_KEY`
  - **Reference ID** → `VITE_SUPABASE_PROJECT_ID`

### Passo 5: Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build completar (2-5 minutos)
3. Seu site estará disponível em um URL tipo: `https://random-name-12345.netlify.app`

### Passo 6: Configurar Domínio Customizado (Opcional)

1. Vá para **Site settings** → **Domain management**
2. Clique em **"Add custom domain"**
3. Siga as instruções para configurar DNS

## 🚀 Opção 2: Deploy via Netlify CLI

### Instalação

```bash
npm install -g netlify-cli
```

### Login

```bash
netlify login
```

### Deploy Manual

```bash
# Build do projeto
npm run build

# Deploy
netlify deploy --prod
```

## 🔒 Configurar CORS no Supabase

Depois do deploy, você precisa permitir que seu domínio Netlify acesse o Supabase:

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para **Authentication** → **URL Configuration**
3. Em **Site URL**, adicione: `https://seu-site.netlify.app`
4. Em **Redirect URLs**, adicione:
   - `https://seu-site.netlify.app`
   - `https://seu-site.netlify.app/auth/callback` (se usar OAuth)

## 🔄 Deploy Contínuo

O Netlify automaticamente fará deploy quando você fizer push para o branch principal:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 🐛 Troubleshooting

### Build falha com erro de memória

Adicione no `netlify.toml`:

```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Variáveis de ambiente não funcionam

- Certifique-se de que todas começam com `VITE_`
- Reconstrua o site após adicionar variáveis
- Limpe o cache: **Site settings** → **Build & deploy** → **Clear cache and retry deploy**

### Página 404 ao navegar

- Confirme que `_redirects` existe em `public/`
- Confirme que `netlify.toml` tem a configuração de redirects

### Erro de CORS

- Configure **Site URL** e **Redirect URLs** no Supabase
- Adicione seu domínio Netlify às configurações do Supabase

## 📊 Monitoramento

Após o deploy, monitore:

1. **Analytics:** Netlify Analytics (pago) ou Google Analytics
2. **Errors:** Netlify Functions logs
3. **Performance:** Netlify Speed insights
4. **Uptime:** [UptimeRobot](https://uptimerobot.com) (gratuito)

## 🔐 Segurança Pós-Deploy

- [ ] Habilite HTTPS (automático no Netlify)
- [ ] Configure headers de segurança (já configurado no `netlify.toml`)
- [ ] Revise políticas de CORS no Supabase
- [ ] Configure rate limiting no Supabase
- [ ] Habilite 2FA no Netlify
- [ ] Configure branch deploy previews

## 📝 Deploy de Branches de Desenvolvimento

Para testar mudanças antes de ir para produção:

1. Crie um branch:
   ```bash
   git checkout -b feature/nova-funcionalidade
   git push origin feature/nova-funcionalidade
   ```

2. Netlify criará automaticamente um **Deploy Preview**
3. URL estará em **Deploy log** → **Deploy preview**

## 🌟 Otimizações Pós-Deploy

### Habilitar Netlify Forms (se usar formulários)

No HTML, adicione `netlify` ou `data-netlify="true"`:

```html
<form netlify>
  <!-- campos -->
</form>
```

### Configurar Redirects Adicionais

Edite `netlify.toml`:

```toml
[[redirects]]
  from = "/old-url"
  to = "/new-url"
  status = 301
```

### Adicionar Notificações de Deploy

1. **Site settings** → **Build & deploy** → **Deploy notifications**
2. Configure Slack, email, ou webhook

## 📞 Suporte

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Netlify Support:** [support.netlify.com](https://support.netlify.com)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

**Status do Deploy:** ✅ Configurado e pronto para deploy

**Última atualização:** 2025-10-29
