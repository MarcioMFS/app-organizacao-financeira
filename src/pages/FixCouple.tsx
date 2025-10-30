import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function FixCouple() {
  const { user, couple, setCouple } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const createCouple = async () => {
    if (!user) {
      setError('Usuário não encontrado. Faça login novamente.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Verificar se já existe um casal
      const { data: existingCouple } = await supabase
        .from('couples')
        .select('*')
        .or(`person_a_id.eq.${user.id},person_b_id.eq.${user.id}`)
        .single()

      if (existingCouple) {
        setError('Você já tem um casal criado. Tente recarregar a página.')
        // Atualizar o estado
        setCouple({
          id: existingCouple.id,
          personAId: existingCouple.person_a_id,
          personBId: existingCouple.person_b_id || '',
          personAName: existingCouple.person_a_name,
          personBName: existingCouple.person_b_name,
          createdAt: new Date(existingCouple.created_at),
          currency: existingCouple.currency,
          closingDay: existingCouple.closing_day,
        })
        setTimeout(() => navigate('/dashboard'), 2000)
        return
      }

      // Criar novo casal
      const { data: newCouple, error: coupleError } = await supabase
        .from('couples')
        .insert({
          person_a_id: user.id,
          person_a_name: user.name,
          person_b_name: 'Aguardando convite',
          currency: 'BRL',
          closing_day: 1,
        })
        .select()
        .single()

      if (coupleError) throw coupleError

      if (newCouple) {
        // Criar categorias padrão
        const { error: categoriesError } = await supabase.rpc('create_default_categories', {
          couple_id_param: newCouple.id,
        })

        if (categoriesError) {
          console.error('Erro ao criar categorias:', categoriesError)
          // Não lançar erro, apenas avisar
        }

        // Atualizar o estado
        setCouple({
          id: newCouple.id,
          personAId: newCouple.person_a_id,
          personBId: newCouple.person_b_id || '',
          personAName: newCouple.person_a_name,
          personBName: newCouple.person_b_name,
          createdAt: new Date(newCouple.created_at),
          currency: newCouple.currency,
          closingDay: newCouple.closing_day,
        })

        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    } catch (err: any) {
      console.error('Erro ao criar casal:', err)
      setError(err.message || 'Erro ao criar casal. Verifique se o SQL schema foi executado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {couple ? 'Casal Encontrado!' : 'Casal Não Encontrado'}
        </h1>

        {couple ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              ✅ Seu casal já foi criado com sucesso!
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>ID:</strong> {couple.id}</p>
              <p><strong>Pessoa A:</strong> {couple.personAName}</p>
              <p><strong>Pessoa B:</strong> {couple.personBName}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Ir para o Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-2">⚠️ Problema Detectado</p>
              <p>Seu casal não foi criado automaticamente durante o registro.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold mb-2">Isso pode acontecer se:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Você se registrou antes de executar o SQL schema</li>
                <li>O SQL schema não foi executado no Supabase</li>
                <li>Houve algum erro durante o registro</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                ✅ Casal criado com sucesso! Redirecionando...
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={createCouple}
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando casal...' : 'Criar Casal Agora'}
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Voltar ao Dashboard
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-2">💡 Solução Permanente:</p>
              <p>Execute o arquivo <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">supabase-schema.sql</code> no SQL Editor do Supabase para evitar esse problema no futuro.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
