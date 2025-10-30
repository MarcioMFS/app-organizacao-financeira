-- =====================================================
-- SETUP INICIAL PARA MARCIO & ALANA
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Deletar dados antigos se existirem (cuidado: isso apaga TUDO!)
-- DESCOMENTE AS LINHAS ABAIXO APENAS SE QUISER LIMPAR O BANCO COMPLETAMENTE
-- DELETE FROM transactions;
-- DELETE FROM categories;
-- DELETE FROM reserves;
-- DELETE FROM couples;
-- DELETE FROM profiles;

-- 2. Criar o casal fixo para Marcio & Alana
INSERT INTO couples (id, person_a_id, person_b_id, person_a_name, person_b_name, currency, closing_day, created_at, updated_at)
VALUES (
  'marcio-alana-couple',
  'marcio',
  'alana',
  'Marcio',
  'Alana',
  'BRL',
  1,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  person_a_name = 'Marcio',
  person_b_name = 'Alana',
  updated_at = NOW();

-- 3. Criar categorias padrão usando a função
SELECT create_default_categories('marcio-alana-couple');

-- 4. Verificar se foi criado corretamente
SELECT * FROM couples WHERE id = 'marcio-alana-couple';

-- 5. Verificar categorias criadas
SELECT COUNT(*) as total_categorias FROM categories WHERE couple_id = 'marcio-alana-couple';

-- =====================================================
-- PRONTO! Agora você pode usar o app com a senha: 15022025MA
-- =====================================================
