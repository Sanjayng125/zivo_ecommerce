import { Address } from "@/types"
import { create } from "zustand"

interface CheckoutStore {
    selectedAddress: Address | null
    razorpayOrderId: string | null
    orderId: string | null
    setSelectedAddress: (address: Address) => void
    setOrderIds: (orderId: string, razorpayOrderId: string) => void
    clear: () => void
}

export const useCheckoutStore = create<CheckoutStore>(
    (set) => ({
        selectedAddress: null,
        orderId: null,
        razorpayOrderId: null,

        setSelectedAddress(selectedAddress) {
            set(() => ({ selectedAddress }))
        },

        setOrderIds(orderId, razorpayOrderId) {
            set(() => ({ orderId, razorpayOrderId }))
        },

        clear() {
            set(() => ({ selectedAddress: null }))
        },
    })
)
