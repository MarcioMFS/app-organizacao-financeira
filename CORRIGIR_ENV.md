# 🔧 Como Corrigir o arquivo .env

## Problema Identificado

A `VITE_SUPABASE_ANON_KEY` no seu arquivo `.env` está incorreta. O valor `15022025Alana` não é uma chave válida do Supabase.

## Solução: Obter as chaves corretas

### Passo 1: Acessar o Painel do Supabase

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **fepzrjrtjsknxfwctjle**

### Passo 2: Encontrar as Chaves da API

1. No menu lateral esquerdo, clique em **⚙️ Settings** (Configurações)
2. Clique em **API**
3. Você verá duas seções importantes:

#### Project URL
```
https://fepzrjrtjsknxfwctjle.supabase.co
```
✅ Esta URL já está correta no seu .env

#### Project API Keys

Você verá duas chaves:
- **anon/public** - Esta é a que você precisa! (um token JWT longo)
- **service_role** - NÃO use esta (é secreta e só para backend)

### Passo 3: Copiar a Chave Correta

1. Encontre a seção **"anon public"**
2. Clique no ícone de **copiar** (📋) ao lado da chave
3. A chave deve começar com `eyJ...` e ter cerca de 200-300 caracteres

**Exemplo de como uma chave válida se parece:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcHpyanJ0anNrbnhmd2N0amxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUyNjg0MDAsImV4cCI6MTk5MDg0NDQwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Passo 4: Atualizar o arquivo .env

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua o valor de `VITE_SUPABASE_ANON_KEY` pela chave que você copiou:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://fepzrjrtjsknxfwctjle.supabase.co
VITE_SUPABASE_ANON_KEY=cole_aqui_a_chave_que_voce_copiou
```

### Passo 5: Executar o Schema SQL (se ainda não fez)

1. No painel do Supabase, clique em **🗄️ SQL Editor** no menu lateral
2. Clique em **+ New query**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. Copie TODO o conteúdo do arquivo
5. Cole no editor SQL do Supabase
6. Clique em **Run** (▶️)
7. Aguarde a mensagem de sucesso

### Passo 6: Reiniciar o Servidor de Desenvolvimento

**IMPORTANTE:** Mudanças no arquivo `.env` só são aplicadas ao reiniciar o servidor.

1. No terminal onde o app está rodando, pressione **Ctrl+C** para parar
2. Execute novamente:
```bash
npm run dev
```

### Passo 7: Testar o App

1. Acesse http://localhost:5173
2. Clique em **"Cadastre-se"**
3. Preencha os dados e crie uma conta
4. Se tudo estiver correto:
   - ✅ A conta será criada
   - ✅ Você será redirecionado para o Dashboard
   - ✅ As categorias padrão serão criadas automaticamente
   - ✅ Você poderá adicionar lançamentos

## 🔍 Como Verificar se Está Funcionando

### Console do Navegador (F12)

Abra o console do navegador (tecla F12) e verifique:

**❌ Se a chave estiver errada, você verá:**
```
Error: Invalid API key
Error: Failed to fetch
401 Unauthorized
```

**✅ Se a chave estiver correta, você NÃO verá esses erros**

### Testando o Cadastro

Ao criar uma conta, o console deve mostrar:
```
✅ Profile criado com sucesso
✅ Casal criado com sucesso
✅ Categorias padrão criadas
```

## ⚠️ Problemas Comuns

### Erro: "Invalid API key"
- A ANON_KEY está incorreta
- Verifique se copiou a chave "anon/public" e não a "service_role"
- Certifique-se de que não há espaços extras antes ou depois da chave

### Erro: "Failed to fetch"
- Verifique sua conexão com a internet
- Verifique se a URL está correta
- O projeto Supabase pode estar pausado (projetos gratuitos pausam após inatividade)

### Categorias não aparecem
- Execute o arquivo `supabase-schema.sql` no SQL Editor
- Aguarde alguns segundos após o registro
- Recarregue a página

### Ainda não funciona
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Tente em uma aba anônima
- Verifique se o projeto Supabase está ativo no dashboard

## 📞 Verificação Final

Depois de seguir todos os passos:

1. ✅ .env com ANON_KEY correta (token longo começando com eyJ...)
2. ✅ SQL schema executado no Supabase
3. ✅ Servidor reiniciado (npm run dev)
4. ✅ Sem erros no console do navegador (F12)

Se todos os itens acima estiverem ✅, o app deve funcionar perfeitamente!
