import { GuestCartItem } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandMMKVStorage } from "./mmkvStorage";

interface CartStore {
    items: GuestCartItem[],
    addItem: (item: GuestCartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (quantity: number, id: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set): CartStore => ({
            items: [],

            addItem(newItem) {
                set(state => {
                    const exists = state.items.some(
                        item => item.id === newItem.id
                    )

                    if (exists) {
                        return {
                            items: state.items.map(item =>
                                item.id === newItem.id
                                    ? {
                                        ...item,
                                        quantity: Math.min((item.quantity + 1), 10)
                                    }
                                    : item
                            )
                        }
                    }

                    return {
                        items: [newItem, ...state.items]
                    }
                })
            },

            removeItem(id) {
                set(state => ({
                    items: state.items.filter(item => item.id !== id)
                }))
            },

            updateQuantity(quantity, id) {
                set(state => ({
                    items: state.items.map(item =>
                        item.id === id
                            ? { ...item, quantity: Math.min(quantity, 10) }
                            : item
                    )
                }))
            },

            clearCart() {
                set({ items: [] })
            },
        }),
        {
            name: "cartStore",
            storage: createJSONStorage(() => zustandMMKVStorage),
        }
    )
)
