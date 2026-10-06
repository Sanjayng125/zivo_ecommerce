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

export type Banner = {
    id: string
    image_url: string
    link: string
    sort_order: number
}

export type Category = {
    id: string
    name: string
    slug: string
    image_url: string | null
    sort_order: number
}

export type Product = {
    id: string
    title: string
    slug: string
    base_price: number
    cover_image: string
    rating_avg: string
    rating_count: number
    category_id: string
}

export type HomeSection = {
    id: string
    key: string
    title: string
    type: 'banner' | 'category_row' | 'product_row'
    sort_order: number
    is_active: boolean
    active_banners?: Banner[]
    active_categories?: Category[]
    new_arrivals?: Product[]
    best_sellers?: Product[]
}
