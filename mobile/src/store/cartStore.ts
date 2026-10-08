import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandMMKVStorage } from "./mmkvStorage";

interface CartItem {
    variant_id: string
    quantity: number
}

interface CartStore {
    items: CartItem[],
    addItem: (item: CartItem) => void
    removeItem: (variant_id: string) => void
    updateQuantity: (quantity: number, variant_id: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set): CartStore => ({
            items: [],

            addItem(newItem) {
                set(state => {
                    const exists = state.items.some(
                        item => item.variant_id === newItem.variant_id
                    )

                    if (exists) {
                        return {
                            items: state.items.map(item =>
                                item.variant_id === newItem.variant_id
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

            removeItem(variant_id) {
                set(state => ({
                    items: state.items.filter(item => item.variant_id !== variant_id)
                }))
            },

            updateQuantity(quantity, variant_id) {
                set(state => ({
                    items: state.items.map(item =>
                        item.variant_id === variant_id
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
