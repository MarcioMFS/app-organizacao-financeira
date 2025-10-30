import { create } from 'zustand'
import { User, Couple } from '../types'

// UUIDs do banco de dados Supabase
const COUPLE_ID_FIXO = '53b0c856-5a63-4096-930b-adbc8932100b'
const MARCIO_ID = 'f4748be0-9527-46ef-ba13-ac5fad9dac56'
const ALANA_ID = '2f2c573c-f234-4a29-b36d-956e91584cb3'

interface AuthState {
  user: User | null
  couple: Couple | null
  loading: boolean
  initialized: boolean
  initialize: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  couple: null,
  loading: false,
  initialized: false,

  initialize: () => {
    // Verificar se está autenticado (senha correta foi digitada)
    const authenticated = localStorage.getItem('authenticated') === 'true'

    if (authenticated) {
      // Criar user e couple com os IDs corretos do banco
      const user: User = {
        id: MARCIO_ID,
        email: 'marcioealana@app.com',
        name: 'Marcio & Alana',
        createdAt: new Date(),
      }

      const couple: Couple = {
        id: COUPLE_ID_FIXO,
        personAId: MARCIO_ID,
        personBId: ALANA_ID,
        personAName: 'Marcio',
        personBName: 'Alana',
        createdAt: new Date(),
        currency: 'BRL',
        closingDay: 1,
      }

      set({ user, couple, initialized: true })
    } else {
      set({ user: null, couple: null, initialized: true })
    }
  },

  logout: () => {
    localStorage.removeItem('authenticated')
    set({ user: null, couple: null })
  },
}))
