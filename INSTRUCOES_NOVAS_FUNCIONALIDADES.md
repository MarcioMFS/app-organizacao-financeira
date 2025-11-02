# Instruções - Novas Funcionalidades do App Financeiro

## Visão Geral

Foram implementadas 4 novas funcionalidades principais para melhorar a gestão financeira de Marcio & Alana:

1. **Gastos Fixos e Parcelados**
2. **Receitas Fixas**
3. **Metas Financeiras**
4. **Histórico de Quitações**

---

## 📋 Passo a Passo para Ativação

### 1. Atualizar o Banco de Dados

1. Acesse o **Supabase Dashboard** (https://supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Abra o arquivo `NOVAS_TABELAS.sql` (na raiz do projeto)
5. Copie TODO o conteúdo do arquivo
6. Cole no SQL Editor do Supabase
7. Clique em **Run** (ou F5)
8. Aguarde a mensagem de sucesso

**Verificação**: Você deve ver no final a contagem de registros das novas tabelas (inicialmente 0).

### 2. Deploy/Atualização do Código

```bash
# No terminal, na pasta do projeto:

# 1. Instalar dependências (se necessário)
npm install

# 2. Testar localmente
npm run dev

# 3. Build para produção
npm run build

# 4. Deploy no Netlify
# Faça commit das mudanças e push para o repositório
git add .
git commit -m "Adicionar gestão de gastos fixos, receitas fixas, metas e quitações"
git push origin main

# O Netlify fará o deploy automaticamente
```

---

## 🎯 Funcionalidades Implementadas

### 1. Gastos Fixos (/fixed-expenses)

**Para que serve:**
- Cadastrar despesas mensais recorrentes (aluguel, internet, academia, etc.)
- Gerenciar parcelamentos (celular, móveis, etc.)

**Como usar:**
1. Clique em "Gastos Fixos" no menu
2. Clique em "Novo Gasto Fixo"
3. Preencha:
   - Nome (ex: "Aluguel", "Internet")
   - Valor mensal
   - Dia do vencimento (1-31)
   - Categoria (escolha entre as existentes)
   - Responsável (Marcio, Alana ou Ambos)
   - Marque "É um parcelamento?" se for algo parcelado

**Para parcelamentos:**
- Informe parcela atual (ex: 3)
- Total de parcelas (ex: 12)
- Data de início e término

**Exemplos práticos:**
- Aluguel: R$ 1.500,00 / Dia 5 / Ambos / Mensal
- Internet: R$ 100,00 / Dia 10 / Ambos / Mensal
- Celular (parcelado): R$ 250,00 / 12x / Dia 15 / Marcio

---

### 2. Receitas Fixas (/fixed-incomes)

**Para que serve:**
- Cadastrar fontes de renda recorrentes (salário, freelance, aluguel recebido)
- Controlar se a receita é por tempo determinado ou indeterminado

**Como usar:**
1. Clique em "Receitas Fixas" no menu
2. Clique em "Nova Receita Fixa"
3. Preencha:
   - Nome (ex: "Salário Marcio", "Freelance Design")
   - Valor mensal
   - Dia do recebimento
   - Categoria (Salário, Freelance, etc.)
   - Responsável
   - Marque "Receita por tempo indeterminado" ou informe data de término

**Exemplos práticos:**
- Salário Marcio: R$ 5.000,00 / Dia 5 / Indeterminado
- Freelance Alana: R$ 2.000,00 / Dia 15 / Até 31/12/2025
- Aluguel Recebido: R$ 800,00 / Dia 10 / Indeterminado

---

### 3. Metas Financeiras (/financial-goals)

**Para que serve:**
- Definir objetivos financeiros com prazos
- Acompanhar progresso em tempo real
- Organizar por prazo: curto, médio e longo

**Prazos:**
- **Curto Prazo**: até 6 meses (ex: viagem, eletrônico)
- **Médio Prazo**: 6-24 meses (ex: carro, reforma)
- **Longo Prazo**: +24 meses (ex: casa própria, aposentadoria)

**Como usar:**
1. Clique em "Metas" no menu
2. Clique em "Nova Meta"
3. Preencha:
   - Nome da meta (ex: "Viagem Europa")
   - Valor alvo (ex: R$ 15.000,00)
   - Prazo (curto/médio/longo)
   - Prioridade (baixa/média/alta)
   - Categoria personalizada (ex: "viagem", "carro")
   - Ícone (ex: ✈️, 🚗, 🏠)
   - Data meta (opcional)

**Adicionar dinheiro à meta:**
1. Clique no ícone de seta (TrendingUp) no card da meta
2. Escolha "Depósito" ou "Retirada"
3. Informe o valor e descrição
4. O progresso é atualizado automaticamente

**Exemplos práticos:**
- Viagem Europa: R$ 15.000,00 / Médio Prazo / Alta / ✈️
- Fundo de Emergência: R$ 30.000,00 / Longo Prazo / Alta / 💰
- Notebook Novo: R$ 3.500,00 / Curto Prazo / Média / 💻

---

### 4. Histórico de Quitações (/settlements)

**Para que serve:**
- Registrar dívidas/gastos que foram quitados
- Ver quanto foi economizado em negociações
- Ter histórico anual completo de tudo que foi pago

**Como usar:**
1. Clique em "Quitações" no menu
2. Clique em "Registrar Quitação"
3. Preencha:
   - Nome da dívida (ex: "Parcela do celular")
   - Tipo (gasto fixo, parcela, transação, outro)
   - Valor original (quanto era para pagar)
   - Valor quitado (quanto pagou de fato)
   - Data da quitação
   - Responsável

**Filtros disponíveis:**
- Por ano
- Por responsável (Marcio, Alana ou Ambos)

**Visualizações:**
- Total economizado no ano
- Valor original total vs Valor quitado
- Histórico mensal organizado

**Exemplos práticos:**
- Parcela iPhone: Original R$ 250 / Quitado R$ 200 / Economizou R$ 50
- Empréstimo: Original R$ 5.000 / Quitado R$ 4.500 / Economizou R$ 500

---

## 📊 Menu Atualizado

O menu lateral agora inclui (em ordem):

1. Dashboard
2. Lançamentos (transações avulsas)
3. **Gastos Fixos** (novo)
4. **Receitas Fixas** (novo)
5. **Metas** (novo)
6. **Quitações** (novo)
7. Categorias
8. Reservas (antigo, similar a metas mas mais simples)
9. Relatórios
10. Configurações

---

## 🔄 Fluxo de Uso Sugerido

### Mensalmente:

1. **Início do mês:**
   - Verificar "Gastos Fixos" e confirmar vencimentos
   - Verificar "Receitas Fixas" esperadas

2. **Durante o mês:**
   - Lançar transações avulsas em "Lançamentos"
   - Adicionar valores nas "Metas" quando possível

3. **Final do mês:**
   - Registrar quitações em "Quitações"
   - Ver resumo no "Dashboard"
   - Conferir "Relatórios"

---

## 🛠️ Solução de Problemas

### Problema: Tabelas não aparecem no Supabase

**Solução:**
1. Verifique se executou o SQL completo sem erros
2. Vá em **Table Editor** no Supabase
3. Procure pelas tabelas:
   - `fixed_expenses`
   - `fixed_expense_payments`
   - `fixed_incomes`
   - `fixed_income_receipts`
   - `financial_goals`
   - `financial_goal_transactions`
   - `debt_settlements`

### Problema: Erro ao carregar dados

**Solução:**
1. Abra o Console do navegador (F12)
2. Veja se há erros relacionados ao Supabase
3. Verifique se as variáveis de ambiente estão corretas:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Problema: Não consegue criar gastos fixos

**Solução:**
1. Verifique se o `couple_id` está correto
2. Certifique-se de que há categorias de despesa cadastradas
3. Confira o Console para erros detalhados

---

## 💡 Dicas de Uso

### Gastos Fixos:
- Cadastre TODOS os gastos recorrentes (mesmo pequenos)
- Use o campo "Observações" para lembrar detalhes (ex: "pago no cartão X")
- Revise a lista mensalmente para atualizar valores

### Receitas Fixas:
- Coloque data de término em receitas temporárias (freelance, bico)
- Marque "indeterminado" apenas para salário fixo
- Use para projetar renda futura

### Metas:
- Crie metas realistas (use a prioridade!)
- Separe metas de curto/médio/longo prazo
- Celebre quando atingir 100%!

### Quitações:
- Registre SEMPRE que quitar algo
- Mesmo que não tenha economizado, registre (valor original = valor quitado)
- Use para acompanhar progresso anual de quitação de dívidas

---

## 📈 Próximos Passos (Sugestões de Melhorias Futuras)

- [ ] Lembretes automáticos de vencimentos (push notifications)
- [ ] Gráfico de projeção de fluxo de caixa futuro
- [ ] Dashboard de dívidas totais consolidadas
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Integração com Open Banking (automatizar lançamentos)
- [ ] Comparativo mensal/anual visual
- [ ] Alertas quando orçamento de categoria for excedido

---

## 📞 Suporte

Se encontrar algum problema ou bug:

1. Abra o Console do navegador (F12)
2. Tire um print do erro
3. Anote o que estava tentando fazer
4. Documente no arquivo de bugs ou entre em contato

---

## ✅ Checklist de Implementação

- [x] Criar schema SQL das novas tabelas
- [x] Atualizar types TypeScript
- [x] Criar store Zustand (financialStore)
- [x] Implementar página Gastos Fixos
- [x] Implementar página Receitas Fixas
- [x] Implementar página Metas Financeiras
- [x] Implementar página Histórico de Quitações
- [x] Adicionar rotas no App.tsx
- [x] Atualizar menu no Layout
- [ ] Executar SQL no Supabase
- [ ] Testar localmente
- [ ] Deploy em produção

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0.0
