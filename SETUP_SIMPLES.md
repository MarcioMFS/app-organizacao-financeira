# 🚀 Setup Simplificado - App Finanças Marcio & Alana

## ✅ O que foi simplificado

O app agora é **super simples** para uso pessoal:

- ✅ **Sem cadastro/registro** - removido completamente
- ✅ **Senha única**: `15022025MA`
- ✅ **Casal fixo**: Marcio & Alana (já configurado no código)
- ✅ **Sem autenticação complexa** - apenas uma senha

## 🔧 Configuração Inicial (Fazer UMA VEZ)

### Passo 1: Execute o SQL Schema Principal

Se ainda **não executou** o schema principal, execute primeiro:

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Abra o arquivo `supabase-schema.sql`
5. Copie **TODO** o conteúdo
6. Cole no SQL Editor e clique em **Run**

### Passo 2: Execute o Setup do Marcio & Alana

Agora execute o setup específico para você e Alana:

1. Ainda no **SQL Editor** do Supabase
2. Abra o arquivo `supabase-setup-marcio-alana.sql`
3. Copie **TODO** o conteúdo
4. Cole no SQL Editor e clique em **Run**

Isso vai:
- ✅ Criar o casal fixo com ID: `marcio-alana-couple`
- ✅ Criar as 25+ categorias padrão
- ✅ Deixar tudo pronto para uso

## 🎯 Como Usar o App

### 1. Iniciar o App

```bash
npm run dev
```

O app vai abrir em: http://localhost:5173

### 2. Fazer Login

1. Você verá uma tela de login simples
2. Digite a senha: `15022025MA`
3. Clique em **Entrar**
4. Pronto! Você está no Dashboard

### 3. Usar o App Normalmente

Agora você pode:
- ✅ Adicionar lançamentos (receitas e despesas)
- ✅ Criar categorias personalizadas
- ✅ Ver relatórios e gráficos
- ✅ Gerenciar reservas
- ✅ Configurar o app

## 🔒 Segurança

**Importante:**
- A senha `15022025MA` está **no código do app**
- Qualquer pessoa com acesso ao código pode ver a senha
- **Não compartilhe o código** com outras pessoas
- **Não faça deploy público** (Vercel, Netlify, etc.) sem adicionar autenticação real
- Para uso local (localhost) está perfeito!

## ℹ️ Informações Técnicas

### Dados Fixos no Código:

```typescript
// authStore.ts
COUPLE_ID: 'marcio-alana-couple'
User ID: 'marcio-alana-user'
Pessoa A: 'Marcio'
Pessoa B: 'Alana'
```

### Senha de Acesso:
```
15022025MA
```

### Como funciona:
1. Você digita a senha no login
2. App salva `authenticated: true` no localStorage
3. App carrega dados do Supabase usando o couple_id fixo
4. Todos os dados são salvos no Supabase normalmente

## 🔄 Para Sair do App

1. Clique no ícone de perfil no cabeçalho
2. Clique em **Sair**
3. Ou limpe o localStorage do navegador (F12 → Application → Local Storage)

## ❓ Solução de Problemas

### Erro: "Casal não encontrado"

Execute o arquivo `supabase-setup-marcio-alana.sql` no Supabase.

### Senha não funciona

A senha é: `15022025MA` (com letras maiúsculas)

### Dados não aparecem

1. Verifique se executou o `supabase-setup-marcio-alana.sql`
2. Abra o console (F12) e veja se há erros
3. Verifique se a ANON_KEY está correta no `.env`

### Quer mudar a senha?

Edite o arquivo `src/pages/Login.tsx` linha 5:
```typescript
const SENHA_CORRETA = 'SUA_NOVA_SENHA_AQUI'
```

## 📱 Instalando como PWA

O app pode ser instalado no PC/celular:

1. No navegador (Chrome), clique no ícone de instalação na barra de endereço
2. Ou menu → "Instalar App Finanças a Dois"
3. Pronto! Agora você tem um app desktop/mobile

## 🎉 Pronto!

Agora vocês podem usar o app tranquilamente para organizar as finanças do casal!

**Marcio & Alana** ❤️
