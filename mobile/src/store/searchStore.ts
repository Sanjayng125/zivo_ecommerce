import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { zustandMMKVStorage } from "./mmkvStorage"

interface SearchStore {
    searchHistory: string[]
    addQuery: (query: string) => void
    clearHistory: () => void
}

export const useSearchStore = create<SearchStore>()(
    persist(
        (set, get): SearchStore => ({
            searchHistory: [],

            addQuery(query) {
                const newQuery = query.trim().toLowerCase()

                if (!newQuery) return

                const history = get().searchHistory

                const newHistory = [
                    newQuery,
                    ...history.filter(q => q !== newQuery).slice(0, 9),
                ]

                set(() => ({ searchHistory: newHistory }))
            },

            clearHistory() {
                set(() => ({ searchHistory: [] }))
            },
        }),
        {
            name: "searchStore",
            storage: createJSONStorage(() => zustandMMKVStorage),
        }
    )
)
