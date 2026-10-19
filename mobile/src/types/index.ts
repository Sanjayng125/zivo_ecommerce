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
    id?: string
    user_id?: string
    variant_id: string
    quantity: number
    title: string
    slug: string
    price: number
    cover_image: string
    size: string | null
    color: string | null
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
    bg_image?: string
    type: 'banner' | 'category_row' | 'product_row'
    sort_order: number
    is_active: boolean
    items: any[]
}

export type Review = {
    id: string
    user_id: string
    product_id: string
    rating: number
    title: string
    comment: string
    full_name: string
    avatar_url: string
    created_at: string
    updated_at: string
}

export type Address = {
    id: string
    user_id: string
    full_name: string
    phone: string
    line1: string
    line2: string
    city: string
    state: string
    pincode: string
    is_default: boolean
    created_at: string
    updated_at: string
}
