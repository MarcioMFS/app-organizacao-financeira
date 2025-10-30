# 📖 Como Usar o App Finanças a Dois

## 🚀 Início Rápido

### 1. Primeiro Acesso

1. Acesse http://localhost:5173/
2. Clique em **"Cadastre-se"**
3. Preencha seu nome, email e senha
4. Clique em **"Criar conta"**

✅ **Pronto!** O sistema irá automaticamente:
- Criar seu perfil no Supabase
- Criar um "casal" vinculado a você
- Criar 25+ categorias padrão para você começar
- Redirecionar para o Dashboard

### 2. Fazendo Login

1. Acesse http://localhost:5173/login
2. Digite seu email e senha
3. Clique em **"Entrar"**

## 📊 Funcionalidades

### 🏠 Dashboard

O Dashboard mostra uma visão geral das suas finanças:

- **Cards principais:**
  - Total de receitas do mês
  - Total de despesas do mês
  - Saldo (receitas - despesas)
  - Taxa de economia (%)

- **Gráficos:**
  - Distribuição de gastos por categoria
  - Top categorias de maior gasto

- **Lançamentos recentes:**
  - Últimos 5 lançamentos

### 💰 Lançamentos (Transações)

#### Adicionar novo lançamento:

1. Clique em **"Novo Lançamento"**
2. Escolha o tipo: **Receita** ou **Despesa**
3. Preencha:
   - Valor
   - Data
   - Descrição (ex: "Supermercado")
   - Categoria
   - Responsável (Pessoa A, Pessoa B, Ambos ou Proporcional)
   - Observações (opcional)
4. Clique em **"Adicionar"**

#### Editar lançamento:

1. Encontre o lançamento na lista
2. Clique no ícone de **lápis** (editar)
3. Faça as alterações
4. Clique em **"Salvar"**

#### Excluir lançamento:

1. Encontre o lançamento na lista
2. Clique no ícone de **lixeira** (excluir)
3. Confirme a exclusão

#### Filtrar lançamentos:

- **Buscar:** Digite na caixa de busca para filtrar por descrição
- **Tipo:** Selecione "Todos", "Receitas" ou "Despesas"

### 🏷️ Categorias

#### Visualizar categorias:

- Categorias pré-definidas (não podem ser editadas ou excluídas)
- Categorias personalizadas (você pode editar e excluir)

#### Criar nova categoria:

1. Clique em **"Nova Categoria"**
2. Escolha o tipo: Receita ou Despesa
3. Preencha:
   - Nome da categoria
   - Ícone (emoji)
   - Orçamento mensal (opcional, apenas para despesas)
4. Clique em **"Adicionar"**

#### Editar categoria personalizada:

1. Encontre a categoria na lista
2. Clique no ícone de **lápis**
3. Faça as alterações
4. Clique em **"Salvar"**

### ⚙️ Configurações

#### Modo Escuro/Claro:

1. Vá em **Configurações**
2. Clique no toggle **"Modo Escuro"**

Ou clique no ícone de sol/lua no cabeçalho.

#### Modo Privacidade:

- Ativa/desativa para ocultar valores monetários

#### Perfil:

- Visualize seu nome e email
- Visualize os nomes das Pessoa A e Pessoa B do casal

## 💡 Dicas de Uso

### Organizando suas finanças:

1. **Comece registrando suas receitas:**
   - Salário
   - Freelance
   - Rendimentos

2. **Registre todas as despesas:**
   - Quanto mais detalhado, melhor!
   - Use categorias apropriadas

3. **Atribua corretamente:**
   - **Ambos:** Para gastos compartilhados 50/50
   - **Pessoa A/B:** Para gastos individuais
   - **Proporcional:** Para divisão personalizada

4. **Acompanhe mensalmente:**
   - Verifique o Dashboard regularmente
   - Veja onde está gastando mais
   - Ajuste seus gastos conforme necessário

### Entendendo a Taxa de Economia:

```
Taxa de Economia = (Receitas - Despesas) / Receitas × 100
```

**Exemplos:**
- Receitas: R$ 5.000 / Despesas: R$ 4.000 = **20% de economia** ✅
- Receitas: R$ 5.000 / Despesas: R$ 5.000 = **0% de economia** ⚠️
- Receitas: R$ 5.000 / Despesas: R$ 6.000 = **-20% (no vermelho)** ❌

### Divisão Proporcional:

Use quando os gastos não são 50/50:

**Exemplo:**
- Aluguel de R$ 2.000
- Pessoa A paga 60% = R$ 1.200
- Pessoa B paga 40% = R$ 800

## 🔒 Segurança e Privacidade

- ✅ Todos os dados são armazenados no Supabase
- ✅ Criptografia de ponta a ponta
- ✅ Row Level Security (RLS) - seus dados são isolados
- ✅ Autenticação segura
- ✅ Você controla 100% dos seus dados

## 🛠️ Solução de Problemas

### Não consigo fazer login

- Verifique se o email e senha estão corretos
- Verifique se o Supabase está configurado corretamente

### Categorias não aparecem

- Aguarde alguns segundos após o registro
- Recarregue a página (F5)
- Verifique o console do navegador (F12) para erros

### Dados não são salvos

- Verifique sua conexão com a internet
- Verifique se o Supabase está online
- Veja o console do navegador para erros

### Dashboard vazio

- Adicione alguns lançamentos primeiro
- Os gráficos só aparecem quando há dados

## 📱 PWA (Progressive Web App)

Este app pode ser instalado como um aplicativo nativo:

**No Desktop (Chrome/Edge):**
1. Clique no ícone de instalação na barra de endereço
2. Clique em "Instalar"

**No Mobile (Android/iOS):**
1. Abra o menu do navegador
2. Escolha "Adicionar à tela inicial"

**Benefícios:**
- Funciona offline (após primeira visita)
- Ícone na tela inicial
- Experiência de app nativo
- Notificações push (futuro)

## 🎯 Metas Sugeridas

Para aproveitar ao máximo o app:

1. **Primeira Semana:**
   - Registre todas as despesas diárias
   - Cadastre suas receitas mensais
   - Explore as categorias

2. **Primeiro Mês:**
   - Complete 30 dias de lançamentos
   - Analise o Dashboard ao final do mês
   - Identifique categorias com maior gasto

3. **Longo Prazo:**
   - Mantenha taxa de economia >15%
   - Reduza gastos desnecessários
   - Aumente investimentos e reservas

## 🆘 Suporte

Problemas? Dúvidas?

1. Verifique este guia
2. Consulte o README.md
3. Consulte o SUPABASE_SETUP.md
4. Abra uma issue no GitHub

---

**Boas finanças! 💰❤️**
