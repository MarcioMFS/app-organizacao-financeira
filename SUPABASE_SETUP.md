# Configuração do Supabase

Este guia mostra como configurar o Supabase para o aplicativo Finanças a Dois.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Name:** financas-casal (ou nome de sua preferência)
   - **Database Password:** Escolha uma senha forte
   - **Region:** Escolha a região mais próxima (ex: South America - São Paulo)
5. Clique em "Create new project"
6. Aguarde a criação do projeto (pode levar alguns minutos)

## 2. Configurar Variáveis de Ambiente

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie os valores de:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public** key

3. No projeto, crie o arquivo `.env` na raiz (copie do `.env.example`):

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e cole os valores:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 3. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar

Isso irá criar:
- ✅ Todas as tabelas necessárias (profiles, couples, categories, transactions, reserves, etc.)
- ✅ Índices para performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers automáticos
- ✅ Função para criar categorias padrão

## 4. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. (Opcional) Configure **Email Templates** para personalizar emails de confirmação
4. (Opcional) Desabilite confirmação de email para desenvolvimento:
   - Vá em **Authentication** > **Settings**
   - Desmarque "Enable email confirmations"

## 5. Testar a Aplicação

1. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Acesse http://localhost:5173

3. Crie uma nova conta em "Cadastre-se"

4. Faça login com as credenciais criadas

5. O sistema irá:
   - ✅ Criar seu perfil automaticamente
   - ✅ Criar um casal vinculado a você
   - ✅ Criar 25+ categorias padrão
   - ✅ Carregar os dados no dashboard

## 6. Verificar Dados no Supabase

1. No painel do Supabase, vá em **Table Editor**
2. Verifique se as tabelas foram criadas:
   - `profiles` - Deve conter seu perfil
   - `couples` - Deve conter seu casal
   - `categories` - Deve conter as categorias padrão

## 7. Estrutura do Banco de Dados

### Tabelas Principais

- **profiles**: Perfis dos usuários
- **couples**: Casais (relacionamento entre dois perfis)
- **categories**: Categorias de receitas e despesas
- **transactions**: Lançamentos financeiros
- **reserves**: Reservas e objetivos financeiros
- **reserve_transactions**: Movimentações das reservas

### Relacionamentos

```
auth.users (Supabase Auth)
    ↓
profiles (1:1 com users)
    ↓
couples (1 ou 2 profiles)
    ↓
    ├─→ categories (N categorias por casal)
    ├─→ transactions (N transações por casal)
    └─→ reserves (N reservas por casal)
            ↓
        reserve_transactions (N movimentações por reserva)
```

## 8. Segurança (Row Level Security)

O banco de dados está configurado com RLS (Row Level Security) para garantir que:

- ✅ Usuários só veem seus próprios dados
- ✅ Usuários só podem modificar dados do seu casal
- ✅ Dados são isolados entre casais
- ✅ Autenticação é obrigatória para todas as operações

## 9. Solução de Problemas

### Erro: "Missing Supabase environment variables"

- Verifique se o arquivo `.env` está na raiz do projeto
- Verifique se as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento

### Erro ao criar conta

- Verifique se o schema SQL foi executado completamente
- Verifique se o trigger `on_auth_user_created` foi criado
- Verifique os logs no painel do Supabase em **Database** > **Logs**

### Categorias não aparecem

- Verifique se a função `create_default_categories` foi criada
- Execute manualmente: `SELECT create_default_categories('id-do-casal')`

### Dados não aparecem no dashboard

- Abra o console do navegador (F12)
- Verifique se há erros de autenticação ou permissão
- Verifique as políticas RLS no Supabase

## 10. Próximos Passos

Após configurar o Supabase:

1. ✅ Teste criar lançamentos (receitas e despesas)
2. ✅ Teste criar categorias personalizadas
3. ✅ Verifique o dashboard com dados reais
4. ✅ Teste a autenticação (login/logout)
5. ✅ Teste em diferentes navegadores

## 11. Produção

Para deploy em produção:

1. Configure variáveis de ambiente no seu serviço de hosting (Vercel, Netlify, etc.)
2. Habilite confirmação de email
3. Configure email templates personalizados
4. Revise políticas de segurança RLS
5. Configure backup automático no Supabase

## 12. Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## 13. Suporte

Se encontrar problemas:

1. Verifique os logs no console do navegador
2. Verifique os logs no painel do Supabase
3. Consulte a documentação oficial
4. Abra uma issue no repositório do projeto
