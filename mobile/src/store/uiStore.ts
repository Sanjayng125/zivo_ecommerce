import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandMMKVStorage } from './mmkvStorage'

type Theme = 'light' | 'dark'

interface ThemeStore {
    theme: Theme
    toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set): ThemeStore => ({
            theme: 'light',
            toggleTheme: () => {
                set((state) => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                }))
            },
        }),
        {
            name: 'themeStore',
            storage: createJSONStorage(() => zustandMMKVStorage),
            partialize: (state) => ({ theme: state.theme }),
        }
    )
)
