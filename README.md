# 💑 Finanças a Dois

Aplicativo web PWA (Progressive Web App) projetado para casais que desejam organizar suas finanças de forma colaborativa.

## 🚀 Características Principais (MVP)

- ✅ Sistema de autenticação
- ✅ Dashboard com visão geral mensal
- ✅ Lançamentos financeiros (receitas e despesas)
- ✅ Sistema de categorias personalizáveis
- ✅ Gráficos e visualizações
- ✅ Suporte a modo escuro
- ✅ Design responsivo (mobile-first)
- ✅ PWA (funciona offline)

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Zustand
- **Gráficos:** Recharts
- **Roteamento:** React Router v6
- **PWA:** Vite Plugin PWA
- **Ícones:** Lucide React

## 📦 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/app-organizacao-financeira.git
cd app-organizacao-financeira
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Supabase

⚠️ **IMPORTANTE:** Este app requer Supabase para funcionar.

1. Crie uma conta gratuita em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Siga o guia completo em **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

### 4. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais do Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 5. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

O app estará disponível em http://localhost:5173

## 🌐 PWA

Este aplicativo é um Progressive Web App e pode ser instalado em dispositivos móveis e desktop. Funciona offline após a primeira visita.

## 📱 Funcionalidades

### Dashboard
- Visão geral de receitas e despesas
- Taxa de economia
- Distribuição por categoria
- Lançamentos recentes

### Lançamentos
- Adicionar receitas e despesas
- Atribuir a pessoa A, B, ambos ou proporcional
- Categorização
- Busca e filtros

### Categorias
- Categorias pré-definidas
- Criar categorias personalizadas
- Definir orçamento por categoria

### Configurações
- Modo escuro/claro
- Modo privacidade
- Notificações
- Perfil do casal

## 🔮 Roadmap

### Fase 2 (Em planejamento)
- Sistema de reservas e objetivos
- Comparativos mensais avançados
- Orçamentos por categoria
- Exportação de relatórios PDF

### Fase 3 (Futuro)
- Insights automáticos com IA
- Integração com Open Finance
- Previsões financeiras
- Comunidade e dicas

## 📄 Licença

Este projeto está em desenvolvimento inicial (MVP).

## 💻 Desenvolvido com

- ❤️ React
- 🎨 Tailwind CSS
- ⚡ Vite
- 📊 Recharts
