import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  darkMode: boolean
  privacyMode: boolean
  notifications: boolean
  autoLock: boolean
  autoLockTimeout: number
  toggleDarkMode: () => void
  togglePrivacyMode: () => void
  toggleNotifications: () => void
  toggleAutoLock: () => void
  setAutoLockTimeout: (timeout: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      privacyMode: false,
      notifications: true,
      autoLock: false,
      autoLockTimeout: 5,

      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode
          if (newDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: newDarkMode }
        })
      },

      togglePrivacyMode: () => set((state) => ({ privacyMode: !state.privacyMode })),

      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),

      toggleAutoLock: () => set((state) => ({ autoLock: !state.autoLock })),

      setAutoLockTimeout: (timeout) => set({ autoLockTimeout: timeout }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
