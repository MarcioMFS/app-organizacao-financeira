-- =====================================================
-- SCHEMA SIMPLIFICADO PARA MARCIO & ALANA
-- SEM foreign keys complexas, SEM autenticação Supabase
-- =====================================================

-- ========== DELETAR TABELAS ANTIGAS (se existirem) ==========

DROP TABLE IF EXISTS public.reserve_transactions CASCADE;
DROP TABLE IF EXISTS public.reserves CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.couples CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ========== CRIAR TABELAS SIMPLIFICADAS ==========

CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_a_id UUID NOT NULL,
  person_b_id UUID,
  person_a_name TEXT NOT NULL,
  person_b_name TEXT NOT NULL,
  currency TEXT DEFAULT 'BRL',
  closing_day INTEGER DEFAULT 1 CHECK (closing_day >= 1 AND closing_day <= 31),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN DEFAULT FALSE,
  monthly_budget DECIMAL(10, 2),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id UUID NOT NULL,
  owner TEXT NOT NULL CHECK (owner IN ('person_a', 'person_b', 'both', 'proportional')),
  proportion_a INTEGER CHECK (proportion_a >= 0 AND proportion_a <= 100),
  proportion_b INTEGER CHECK (proportion_b >= 0 AND proportion_b <= 100),
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit', 'credit', 'pix', 'bank_slip')),
  recurrence TEXT DEFAULT 'once' CHECK (recurrence IN ('once', 'daily', 'weekly', 'monthly', 'yearly')),
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL
);

CREATE TABLE public.reserves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  target_date DATE,
  image_url TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.reserve_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserve_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== CRIAR ÍNDICES ==========

CREATE INDEX idx_transactions_couple_id ON public.transactions(couple_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_categories_couple_id ON public.categories(couple_id);
CREATE INDEX idx_reserves_couple_id ON public.reserves(couple_id);
CREATE INDEX idx_reserve_transactions_reserve_id ON public.reserve_transactions(reserve_id);

-- ========== DESABILITAR RLS ==========

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserves DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserve_transactions DISABLE ROW LEVEL SECURITY;

-- ========== CRIAR FUNÇÕES ==========

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON public.couples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reserves_updated_at BEFORE UPDATE ON public.reserves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.create_default_categories(couple_id_param UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.categories (couple_id, name, icon, type, is_default) VALUES
    (couple_id_param, 'Moradia', '🏠', 'expense', TRUE),
    (couple_id_param, 'Contas', '⚡', 'expense', TRUE),
    (couple_id_param, 'Alimentação', '🍽️', 'expense', TRUE),
    (couple_id_param, 'Transporte', '🚗', 'expense', TRUE),
    (couple_id_param, 'Saúde', '💊', 'expense', TRUE),
    (couple_id_param, 'Vestuário', '👕', 'expense', TRUE),
    (couple_id_param, 'Lazer', '🎬', 'expense', TRUE),
    (couple_id_param, 'Alimentação Fora', '🍕', 'expense', TRUE),
    (couple_id_param, 'Educação', '🎓', 'expense', TRUE),
    (couple_id_param, 'Cuidados Pessoais', '💅', 'expense', TRUE),
    (couple_id_param, 'Presentes', '🎁', 'expense', TRUE),
    (couple_id_param, 'Cartão de Crédito', '💳', 'expense', TRUE),
    (couple_id_param, 'Investimentos', '📊', 'expense', TRUE),
    (couple_id_param, 'Empréstimos', '🏦', 'expense', TRUE),
    (couple_id_param, 'Poupança', '💰', 'expense', TRUE),
    (couple_id_param, 'Pets', '🐕', 'expense', TRUE),
    (couple_id_param, 'Viagens', '✈️', 'expense', TRUE),
    (couple_id_param, 'Manutenção', '🔧', 'expense', TRUE),
    (couple_id_param, 'Assinaturas', '📱', 'expense', TRUE),
    (couple_id_param, 'Outros', '➕', 'expense', TRUE),
    (couple_id_param, 'Salário', '💼', 'income', TRUE),
    (couple_id_param, 'Freelance', '💻', 'income', TRUE),
    (couple_id_param, 'Presente', '🎁', 'income', TRUE),
    (couple_id_param, 'Rendimentos', '📈', 'income', TRUE),
    (couple_id_param, 'Outros', '➕', 'income', TRUE);
END;
$$ LANGUAGE plpgsql;

-- ========== INSERIR DADOS DO MARCIO & ALANA ==========

-- Criar perfis (UUIDs gerados automaticamente)
INSERT INTO public.profiles (email, name)
VALUES
  ('marcio@app.com', 'Marcio'),
  ('alana@app.com', 'Alana')
RETURNING *;

-- Criar o casal (UUID gerado automaticamente)
INSERT INTO public.couples (person_a_id, person_b_id, person_a_name, person_b_name, currency, closing_day)
SELECT
  (SELECT id FROM public.profiles WHERE email = 'marcio@app.com'),
  (SELECT id FROM public.profiles WHERE email = 'alana@app.com'),
  'Marcio',
  'Alana',
  'BRL',
  1
RETURNING *;

-- Criar categorias padrão
SELECT create_default_categories((SELECT id FROM public.couples LIMIT 1));

-- ========== VERIFICAÇÃO ==========

SELECT 'Perfis criados:' as info, * FROM public.profiles;
SELECT 'Casal criado:' as info, * FROM public.couples;
SELECT 'Total de categorias:' as info, COUNT(*) as total FROM public.categories;

-- =====================================================
-- PRONTO! Senha do app: 15022025MA
--
-- IMPORTANTE: Copie o UUID do casal e atualize no código!
-- Veja o resultado da query "Casal criado" acima
-- =====================================================
