-- =====================================================
-- NOVAS TABELAS PARA GESTÃO FINANCEIRA COMPLETA
-- Execute este arquivo DEPOIS do EXECUTAR_ESTE.sql
-- =====================================================

-- ========== GASTOS FIXOS E PARCELADOS ==========

CREATE TABLE public.fixed_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category_id UUID NOT NULL,
  owner TEXT NOT NULL CHECK (owner IN ('person_a', 'person_b', 'both', 'proportional')),
  proportion_a INTEGER CHECK (proportion_a >= 0 AND proportion_a <= 100),
  proportion_b INTEGER CHECK (proportion_b >= 0 AND proportion_b <= 100),
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit', 'credit', 'pix', 'bank_slip')),

  -- Campos para parcelamento
  is_installment BOOLEAN DEFAULT FALSE,
  installment_number INTEGER, -- Parcela atual (ex: 3)
  total_installments INTEGER, -- Total de parcelas (ex: 12)
  start_date DATE, -- Quando começou o parcelamento
  end_date DATE, -- Quando termina

  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- Histórico de pagamentos dos gastos fixos
CREATE TABLE public.fixed_expense_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fixed_expense_id UUID NOT NULL,
  reference_month DATE NOT NULL, -- Mês de referência (ex: 2025-01-01)
  paid_date DATE, -- Quando foi pago (null = não pago)
  paid_amount DECIMAL(10, 2), -- Pode ser diferente do valor fixo
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit', 'credit', 'pix', 'bank_slip')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_by UUID -- Quem marcou como pago
);

-- ========== RECEITAS FIXAS ==========

CREATE TABLE public.fixed_incomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category_id UUID NOT NULL,
  owner TEXT NOT NULL CHECK (owner IN ('person_a', 'person_b', 'both')),
  receipt_day INTEGER NOT NULL CHECK (receipt_day >= 1 AND receipt_day <= 31),

  -- Período da receita
  is_indefinite BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL,
  end_date DATE, -- Null se indefinida

  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- Histórico de recebimentos das receitas fixas
CREATE TABLE public.fixed_income_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fixed_income_id UUID NOT NULL,
  reference_month DATE NOT NULL, -- Mês de referência
  received_date DATE, -- Quando foi recebido (null = não recebido)
  received_amount DECIMAL(10, 2), -- Pode ser diferente do valor fixo
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  received_by UUID
);

-- ========== METAS FINANCEIRAS (EVOLUTION DAS RESERVES) ==========

CREATE TABLE public.financial_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,

  -- Prazo da meta
  time_frame TEXT NOT NULL CHECK (time_frame IN ('short', 'medium', 'long')),
  -- short: curto prazo (até 6 meses)
  -- medium: médio prazo (6-24 meses)
  -- long: longo prazo (mais de 24 meses)

  start_date DATE NOT NULL,
  target_date DATE,

  -- Categorização
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT, -- Personalizado: 'viagem', 'carro', 'casa', etc
  icon TEXT DEFAULT '🎯',
  image_url TEXT,

  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_date DATE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- Histórico de movimentações das metas
CREATE TABLE public.financial_goal_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== HISTÓRICO DE QUITAÇÕES ==========

CREATE TABLE public.debt_settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,

  -- Referência ao item quitado
  reference_type TEXT NOT NULL CHECK (reference_type IN ('fixed_expense', 'installment', 'transaction', 'other')),
  reference_id UUID, -- ID da despesa/transação original

  name TEXT NOT NULL,
  description TEXT,
  original_amount DECIMAL(10, 2) NOT NULL,
  settled_amount DECIMAL(10, 2) NOT NULL, -- Pode ser diferente (negociação)

  owner TEXT NOT NULL CHECK (owner IN ('person_a', 'person_b', 'both')),

  settlement_date DATE NOT NULL,
  original_due_date DATE,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- ========== ÍNDICES ==========

CREATE INDEX idx_fixed_expenses_couple_id ON public.fixed_expenses(couple_id);
CREATE INDEX idx_fixed_expenses_is_active ON public.fixed_expenses(is_active);
CREATE INDEX idx_fixed_expense_payments_fixed_expense_id ON public.fixed_expense_payments(fixed_expense_id);
CREATE INDEX idx_fixed_expense_payments_reference_month ON public.fixed_expense_payments(reference_month);

CREATE INDEX idx_fixed_incomes_couple_id ON public.fixed_incomes(couple_id);
CREATE INDEX idx_fixed_incomes_is_active ON public.fixed_incomes(is_active);
CREATE INDEX idx_fixed_income_receipts_fixed_income_id ON public.fixed_income_receipts(fixed_income_id);
CREATE INDEX idx_fixed_income_receipts_reference_month ON public.fixed_income_receipts(reference_month);

CREATE INDEX idx_financial_goals_couple_id ON public.financial_goals(couple_id);
CREATE INDEX idx_financial_goals_is_active ON public.financial_goals(is_active);
CREATE INDEX idx_financial_goals_time_frame ON public.financial_goals(time_frame);
CREATE INDEX idx_financial_goal_transactions_goal_id ON public.financial_goal_transactions(goal_id);

CREATE INDEX idx_debt_settlements_couple_id ON public.debt_settlements(couple_id);
CREATE INDEX idx_debt_settlements_settlement_date ON public.debt_settlements(settlement_date);

-- ========== DESABILITAR RLS ==========

ALTER TABLE public.fixed_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_expense_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_incomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_income_receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goal_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_settlements DISABLE ROW LEVEL SECURITY;

-- ========== TRIGGERS ==========

CREATE TRIGGER update_fixed_expenses_updated_at BEFORE UPDATE ON public.fixed_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixed_incomes_updated_at BEFORE UPDATE ON public.fixed_incomes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_goals_updated_at BEFORE UPDATE ON public.financial_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========== DADOS DE EXEMPLO (OPCIONAL) ==========

-- Exemplo de gasto fixo (aluguel)
-- INSERT INTO public.fixed_expenses (couple_id, name, amount, category_id, owner, due_day, is_installment, is_active, created_by)
-- SELECT
--   (SELECT id FROM public.couples LIMIT 1),
--   'Aluguel',
--   1500.00,
--   (SELECT id FROM public.categories WHERE name = 'Moradia' LIMIT 1),
--   'both',
--   5,
--   false,
--   true,
--   (SELECT id FROM public.profiles WHERE name = 'Marcio' LIMIT 1);

-- Exemplo de parcela (celular)
-- INSERT INTO public.fixed_expenses (couple_id, name, amount, category_id, owner, due_day, is_installment, installment_number, total_installments, start_date, end_date, is_active, created_by)
-- SELECT
--   (SELECT id FROM public.couples LIMIT 1),
--   'Celular iPhone',
--   250.00,
--   (SELECT id FROM public.categories WHERE name = 'Outros' AND type = 'expense' LIMIT 1),
--   'person_a',
--   15,
--   true,
--   1,
--   12,
--   '2025-01-01',
--   '2025-12-01',
--   true,
--   (SELECT id FROM public.profiles WHERE name = 'Marcio' LIMIT 1);

-- Exemplo de receita fixa (salário)
-- INSERT INTO public.fixed_incomes (couple_id, name, amount, category_id, owner, receipt_day, is_indefinite, start_date, is_active, created_by)
-- SELECT
--   (SELECT id FROM public.couples LIMIT 1),
--   'Salário Marcio',
--   5000.00,
--   (SELECT id FROM public.categories WHERE name = 'Salário' LIMIT 1),
--   'person_a',
--   5,
--   true,
--   '2024-01-01',
--   true,
--   (SELECT id FROM public.profiles WHERE name = 'Marcio' LIMIT 1);

-- Exemplo de meta financeira
-- INSERT INTO public.financial_goals (couple_id, name, description, target_amount, time_frame, start_date, target_date, priority, category, icon, is_active, created_by)
-- SELECT
--   (SELECT id FROM public.couples LIMIT 1),
--   'Viagem Europa',
--   'Lua de mel em Paris e Roma',
--   15000.00,
--   'medium',
--   '2025-01-01',
--   '2026-06-01',
--   'high',
--   'viagem',
--   '✈️',
--   true,
--   (SELECT id FROM public.profiles WHERE name = 'Marcio' LIMIT 1);

-- ========== VERIFICAÇÃO ==========

SELECT 'Fixed Expenses criada:' as info, COUNT(*) as total FROM public.fixed_expenses;
SELECT 'Fixed Incomes criada:' as info, COUNT(*) as total FROM public.fixed_incomes;
SELECT 'Financial Goals criada:' as info, COUNT(*) as total FROM public.financial_goals;
SELECT 'Debt Settlements criada:' as info, COUNT(*) as total FROM public.debt_settlements;

-- =====================================================
-- PRONTO! Execute no SQL Editor do Supabase
-- =====================================================
