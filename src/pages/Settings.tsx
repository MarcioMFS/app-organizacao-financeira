import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { User, Moon, Sun, Eye, EyeOff, Bell } from 'lucide-react'

export default function Settings() {
  const { user, couple } = useAuthStore()
  const { darkMode, privacyMode, notifications, toggleDarkMode, togglePrivacyMode, toggleNotifications } = useSettingsStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Personalize sua experiência
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pessoa A
              </label>
              <input
                type="text"
                value={couple?.personAName || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pessoa B
              </label>
              <input
                type="text"
                value={couple?.personBName || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Aparência
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Modo Escuro</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Reduz o brilho da tela
                </div>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacidade
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {privacyMode ? <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Modo Privacidade</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Oculta valores monetários
                </div>
              </div>
            </div>
            <button
              onClick={togglePrivacyMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacyMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacyMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notificações
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Notificações Push</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Receba alertas sobre suas finanças
                </div>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sobre
        </h2>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Versão</span>
            <span className="font-medium">0.1.0 (MVP)</span>
          </div>
          <div className="flex justify-between">
            <span>Desenvolvido com</span>
            <span className="font-medium">React + TypeScript + Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  )
}
