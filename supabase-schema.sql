-- Criar tabela de perfis (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de casais (couples)
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_a_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  person_b_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  person_a_name TEXT NOT NULL,
  person_b_name TEXT NOT NULL,
  currency TEXT DEFAULT 'BRL',
  closing_day INTEGER DEFAULT 1 CHECK (closing_day >= 1 AND closing_day <= 31),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de categorias (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN DEFAULT FALSE,
  monthly_budget DECIMAL(10, 2),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de transações (transactions)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  owner TEXT NOT NULL CHECK (owner IN ('person_a', 'person_b', 'both', 'proportional')),
  proportion_a INTEGER CHECK (proportion_a >= 0 AND proportion_a <= 100),
  proportion_b INTEGER CHECK (proportion_b >= 0 AND proportion_b <= 100),
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit', 'credit', 'pix', 'bank_slip')),
  recurrence TEXT DEFAULT 'once' CHECK (recurrence IN ('once', 'daily', 'weekly', 'monthly', 'yearly')),
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL
);

-- Criar tabela de reservas (reserves)
CREATE TABLE IF NOT EXISTS public.reserves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  target_date DATE,
  image_url TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de transações de reservas (reserve_transactions)
CREATE TABLE IF NOT EXISTS public.reserve_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserve_id UUID REFERENCES public.reserves(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_couple_id ON public.transactions(couple_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_couple_id ON public.categories(couple_id);
CREATE INDEX IF NOT EXISTS idx_reserves_couple_id ON public.reserves(couple_id);
CREATE INDEX IF NOT EXISTS idx_reserve_transactions_reserve_id ON public.reserve_transactions(reserve_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserve_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para couples
CREATE POLICY "Users can view their couples" ON public.couples
  FOR SELECT USING (auth.uid() = person_a_id OR auth.uid() = person_b_id);

CREATE POLICY "Users can update their couples" ON public.couples
  FOR UPDATE USING (auth.uid() = person_a_id OR auth.uid() = person_b_id);

CREATE POLICY "Users can create couples" ON public.couples
  FOR INSERT WITH CHECK (auth.uid() = person_a_id);

-- Políticas RLS para categories
CREATE POLICY "Users can view categories of their couples" ON public.categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.couples
      WHERE id = couple_id
      AND (person_a_id = auth.uid() OR person_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage categories of their couples" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples
      WHERE id = couple_id
      AND (person_a_id = auth.uid() OR person_b_id = auth.uid())
    )
  );

-- Políticas RLS para transactions
CREATE POLICY "Users can view transactions of their couples" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.couples
      WHERE id = couple_id
      AND (person_a_id = auth.uid() OR person_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage transactions of their couples" ON public.transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples
      WHERE id = couple_id
      AND (person_a_id = auth.uid() OR person_b_id = auth.uid())
    )
  );

-- Políticas RLS para reserves
CREATE POLICY "Users can view reserves of their couples" ON public.reserves
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.couples
      WHERE id = couple_id
      AND (person_a_id = auth.uid() OR person_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage reserves of their couples" ON public.reserves
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples
      WHERE id = couple_id
      AND (person_a_id = auth.uid() OR person_b_id = auth.uid())
    )
  );

-- Políticas RLS para reserve_transactions
CREATE POLICY "Users can view reserve transactions of their reserves" ON public.reserve_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.reserves r
      JOIN public.couples c ON r.couple_id = c.id
      WHERE r.id = reserve_id
      AND (c.person_a_id = auth.uid() OR c.person_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage reserve transactions of their reserves" ON public.reserve_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.reserves r
      JOIN public.couples c ON r.couple_id = c.id
      WHERE r.id = reserve_id
      AND (c.person_a_id = auth.uid() OR c.person_b_id = auth.uid())
    )
  );

-- Trigger para atualizar updated_at automaticamente
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

-- Função para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir categorias padrão (será executado após criar um casal)
CREATE OR REPLACE FUNCTION public.create_default_categories(couple_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Categorias de Despesas
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

    -- Categorias de Receitas
    (couple_id_param, 'Salário', '💼', 'income', TRUE),
    (couple_id_param, 'Freelance', '💻', 'income', TRUE),
    (couple_id_param, 'Presente', '🎁', 'income', TRUE),
    (couple_id_param, 'Rendimentos', '📈', 'income', TRUE),
    (couple_id_param, 'Outros', '➕', 'income', TRUE);
END;
$$ LANGUAGE plpgsql;
