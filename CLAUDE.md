# App de Organização Financeira - Marcio & Alana

## Visão Geral

Aplicação web de gerenciamento financeiro para casal, construída especificamente para uso pessoal de Marcio e Alana. O app utiliza autenticação simplificada com senha única e não requer cadastro ou múltiplos usuários.

## Stack Tecnológica

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Zustand
- **Backend/Database**: Supabase (PostgreSQL)
- **Gráficos**: Recharts
- **Roteamento**: React Router DOM v6
- **PWA**: vite-plugin-pwa (Progressive Web App)
- **Ícones**: lucide-react
- **Formatação de Datas**: date-fns

## Comandos de Build

```bash
# Desenvolvimento local
npm run dev

# Build para produção (sem verificação de tipos)
npm run build

# Build com verificação de tipos TypeScript
npm run build:check

# Preview da build de produção
npm run preview

# Linting
npm run lint
```

## Autenticação Simplificada

### Senha Única
- **Senha**: `15022025MA`
- **Sistema**: Autenticação baseada em localStorage
- **Arquivo**: `src/pages/Login.tsx`

O sistema não utiliza o Supabase Auth tradicional. A autenticação é feita através de verificação de senha única, sem email ou cadastro.

```typescript
const SENHA_CORRETA = '15022025MA'
```

### Usuários Fixos (UUIDs do Banco de Dados)

```typescript
// src/store/authStore.ts
const COUPLE_ID_FIXO = '53b0c856-5a63-4096-930b-adbc8932100b'
const MARCIO_ID = 'f4748be0-9527-46ef-ba13-ac5fad9dac56'
const ALANA_ID = '2f2c573c-f234-4a29-b36d-956e91584cb3'
```

**IMPORTANTE**: Estes UUIDs devem corresponder exatamente aos registros no banco de dados Supabase.

## Estrutura do Banco de Dados

### Tabelas Principais

1. **profiles** - Perfis de usuários (Marcio e Alana)
2. **couples** - Dados do casal
3. **categories** - Categorias de receitas/despesas
4. **transactions** - Transações financeiras
5. **reserves** - Reservas financeiras/objetivos
6. **reserve_transactions** - Transações das reservas

### Setup Inicial do Banco

O arquivo `EXECUTAR_ESTE.sql` contém o schema completo. Execute-o no SQL Editor do Supabase:

```sql
-- O script inclui:
-- 1. Desabilitar RLS (Row Level Security)
-- 2. Criar tabelas com UUIDs automáticos
-- 3. Criar função para categorias padrão
-- 4. Popular perfis e casal
-- 5. Criar categorias padrão
```

**Atenção**: O script usa `gen_random_uuid()` do PostgreSQL para gerar UUIDs. Execute em ordem sequencial.

### Categorias Padrão

O sistema cria automaticamente categorias de receitas e despesas através da função `create_default_categories`:

**Receitas**: 💰 Salário, 💼 Freelance, 🎁 Presente, 📈 Investimento, 💵 Outros

**Despesas**: 🏠 Moradia, 🍔 Alimentação, 🚗 Transporte, 💊 Saúde, 🎮 Lazer, 📚 Educação, 👕 Vestuário, 📱 Assinaturas, 🐕 Pet, 💳 Outros

## Arquitetura do Projeto

### Gerenciamento de Estado (Zustand)

#### authStore.ts
- Gerencia autenticação simplificada
- Mantém dados do usuário e casal em memória
- Sincroniza com localStorage

#### dataStore.ts
- Gerencia transações, categorias e reservas
- Sincroniza com Supabase
- Carrega dados automaticamente após inicialização

#### settingsStore.ts
- Modo escuro
- Modo privacidade (oculta valores)
- Notificações

### Páginas Principais

1. **Login** (`src/pages/Login.tsx`) - Autenticação com senha única
2. **Dashboard** (`src/pages/Dashboard.tsx`) - Visão geral financeira
3. **Transactions** - Gestão de transações
4. **Categories** - Gestão de categorias
5. **Reserves** - Gestão de reservas/objetivos
6. **Reports** - Relatórios financeiros
7. **Settings** (`src/pages/Settings.tsx`) - Configurações do app

### Funcionalidades Implementadas

- ✅ Dashboard com resumo mensal
- ✅ Gráficos de distribuição por categoria (Pizza)
- ✅ Lista de maiores gastos
- ✅ Transações recentes
- ✅ Separação de receitas/despesas por pessoa (Marcio/Alana)
- ✅ Divisão proporcional de despesas
- ✅ Sistema de categorias customizáveis
- ✅ Modo escuro
- ✅ Modo privacidade
- ✅ Formatação de moeda (BRL)
- ✅ Filtros de data
- ✅ PWA (funciona offline)

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Deploy (Netlify)

O projeto está configurado para deploy no Netlify:

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure as variáveis de ambiente no Netlify

**Nota**: O script de build não faz verificação de tipos TypeScript para evitar erros de build. Use `npm run build:check` localmente para verificar tipos.

## Problemas Conhecidos e Soluções

### "Couple not found" ao criar categoria
- **Causa**: UUIDs em `authStore.ts` não correspondem ao banco
- **Solução**: Verifique os UUIDs no banco e atualize `authStore.ts`

### Timeout no banco de dados
- **Causa Potencial**: Row Level Security (RLS) habilitado
- **Solução**: Desabilitar RLS ou usar service_role key
- **Query de diagnóstico**:
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### Build errors com TypeScript
- **Causa**: Tipos do Vite não reconhecidos
- **Solução**: Adicionar `/// <reference types="vite/client" />` no topo do arquivo
- **Arquivo afetado**: `src/lib/supabase.ts`

### Categorias não aparecem
- **Causa**: couple_id incorreto nas categorias ou authStore
- **Solução**:
```sql
-- Verificar couple_id
SELECT id, person_a_name, person_b_name FROM couples;

-- Verificar categorias
SELECT id, name, couple_id FROM categories;
```

## Segurança

⚠️ **IMPORTANTE**: Este app usa autenticação simplificada para uso pessoal. Não é adequado para produção com múltiplos usuários.

- Senha hardcoded no código
- Sem criptografia de senha
- Sem recuperação de senha
- Sem controle de acesso baseado em usuário

## Estrutura de Diretórios

```
src/
├── components/       # Componentes React reutilizáveis
├── lib/             # Configurações (Supabase client)
├── pages/           # Páginas da aplicação
├── store/           # Stores do Zustand
├── types/           # Tipos TypeScript
└── App.tsx          # Componente principal
```

## Types (TypeScript)

O arquivo `src/types/database.ts` contém todos os tipos do banco de dados, incluindo:

- Definições de tabelas (Row, Insert, Update)
- Funções do banco (create_default_categories)
- Enums personalizados

## Dados de Teste

Para testar a aplicação localmente, certifique-se de que:

1. O banco de dados foi criado com `EXECUTAR_ESTE.sql`
2. As categorias padrão foram criadas
3. Os UUIDs em `authStore.ts` correspondem aos do banco
4. As variáveis de ambiente estão configuradas

## Manutenção

### Adicionar nova categoria
Execute no SQL Editor:

```sql
INSERT INTO categories (couple_id, name, icon, type, is_default, monthly_budget)
VALUES ('53b0c856-5a63-4096-930b-adbc8932100b', 'Nome', '🎯', 'expense', false, 500.00);
```

### Limpar dados de teste

```sql
DELETE FROM reserve_transactions;
DELETE FROM reserves;
DELETE FROM transactions;
-- Não delete categories, couples ou profiles a menos que vá recriar tudo
```

### Resetar banco completo

```sql
DROP TABLE IF EXISTS reserve_transactions CASCADE;
DROP TABLE IF EXISTS reserves CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS create_default_categories;
```

Depois execute `EXECUTAR_ESTE.sql` novamente.

## Performance

- O app carrega todas as transações na inicialização
- Cálculos mensais são feitos com `useMemo` para otimização
- Supabase Realtime não está habilitado (não necessário para uso pessoal)

## PWA (Progressive Web App)

O app pode ser instalado como aplicativo nativo:

- iOS: "Adicionar à Tela Inicial"
- Android: "Instalar app"
- Desktop: Ícone de instalação na barra de endereços

Configuração em `vite.config.ts` com `vite-plugin-pwa`.

## Contato e Desenvolvimento

- **Desenvolvido para**: Marcio & Alana
- **Versão**: 0.1.0 (MVP)
- **Última atualização**: Janeiro 2025

## Próximos Passos (Futuro)

- [ ] Backup automático de dados
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações push para lembretes
- [ ] Gráficos de evolução temporal
- [ ] Previsão de gastos com IA
- [ ] Integração com bancos (Open Banking)
