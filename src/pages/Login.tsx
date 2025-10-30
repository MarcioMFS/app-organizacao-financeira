import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'

const SENHA_CORRETA = '15022025MA'

export default function Login() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (senha === SENHA_CORRETA) {
      // Salvar no localStorage que está autenticado
      localStorage.setItem('authenticated', 'true')
      navigate('/dashboard')
      // Recarregar a página para inicializar tudo
      window.location.reload()
    } else {
      setErro('Senha incorreta!')
      setSenha('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Heart className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Finanças a Dois
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Marcio & Alana
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Digite a senha"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Entrar
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          App de uso pessoal 💑
        </p>
      </div>
    </div>
  )
}
