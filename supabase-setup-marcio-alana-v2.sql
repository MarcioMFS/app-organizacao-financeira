-- =====================================================
-- SETUP MARCIO & ALANA - Versão Segura
-- Pode executar mesmo se já tiver dados no banco
-- =====================================================

-- OPÇÃO 1: SE QUISER MANTER DADOS EXISTENTES
-- Execute apenas este bloco:

-- Criar o casal fixo (ou atualizar se já existe)
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

-- Criar categorias padrão (se ainda não existem)
-- A função verifica se já existem antes de criar
SELECT create_default_categories('marcio-alana-couple');

-- Verificação: Mostrar o que foi criado
SELECT
  'Casal criado com sucesso!' as status,
  *
FROM couples
WHERE id = 'marcio-alana-couple';

SELECT
  COUNT(*) as total_categorias,
  'categorias criadas' as tipo
FROM categories
WHERE couple_id = 'marcio-alana-couple';

-- =====================================================
-- OPÇÃO 2: SE QUISER LIMPAR TUDO E RECOMEÇAR DO ZERO
-- DESCOMENTE AS LINHAS ABAIXO (remova os -- do início)
-- CUIDADO: Isso vai APAGAR TODOS OS DADOS!
-- =====================================================

-- -- Deletar TODOS os dados antigos
-- DELETE FROM transactions;
-- DELETE FROM reserves;
-- DELETE FROM categories;
-- DELETE FROM couples;
-- DELETE FROM profiles;

-- -- Recriar o casal
-- INSERT INTO couples (id, person_a_id, person_b_id, person_a_name, person_b_name, currency, closing_day, created_at, updated_at)
-- VALUES (
--   'marcio-alana-couple',
--   'marcio',
--   'alana',
--   'Marcio',
--   'Alana',
--   'BRL',
--   1,
--   NOW(),
--   NOW()
-- );

-- -- Recriar categorias padrão
-- SELECT create_default_categories('marcio-alana-couple');

-- =====================================================
-- PRONTO! Execute apenas a OPÇÃO 1 (já está descomentada)
-- =====================================================
