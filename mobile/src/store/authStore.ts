import { User } from "@/types";
import { create } from "zustand";

interface AuthStore {
    user: User | null
    token: string | null
    setUser: (user: User) => void
    setToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
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
    })
)
