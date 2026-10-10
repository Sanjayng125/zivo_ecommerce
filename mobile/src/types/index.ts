export type User = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: string
    updatedAt: string
}

export type CartItem = {
    id: string
    user_id: string
    variant_id: string
    quantity: number
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

export type ProductImage = {
    id: string
    url: string
    product_id: string
    sort_order: number
}

export type ProductVariant = {
    id: string
    sku: string
    size: string | null
    color: string | null
    price: number
    stock: number
    product_id: string
}

export type Product = {
    id: string
    title: string
    description: string
    slug: string
    base_price: number
    cover_image: string
    rating_avg: string
    rating_count: number
    category_id: string
    product_images: ProductImage[]
    product_variants: ProductVariant[]
}

export type HomeSection = {
    id: string
    key: string
    title: string
    type: 'banner' | 'category_row' | 'product_row'
    sort_order: number
    is_active: boolean
    banners?: Banner[]
    categories?: Category[]
    new_arrivals?: Product[]
    best_sellers?: Product[]
}
