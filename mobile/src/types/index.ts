export type User = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: string
    updatedAt: string
}

export type GuestCartItem = {
    variant_id: string
    quantity: number
    title: string
    price: number
    cover_image: string
}
