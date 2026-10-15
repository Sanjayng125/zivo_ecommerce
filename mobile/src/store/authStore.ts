import { User } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandMMKVStorage } from "./mmkvStorage";

interface AuthStore {
    user: User | null
    token: string | null
    setUser: (user: User) => void
    setToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set): AuthStore => ({
            user: null,
            token: null,

            setUser(user) {
                set(() => ({ user: user }))
            },

            setToken(token) {
                set(() => ({ token: token }))
            },

            logout() {
                set(() => ({ user: null, token: null }))
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => zustandMMKVStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
)
