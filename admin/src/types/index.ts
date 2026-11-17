export interface AuthUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role?: string | null;
}


export interface Product {
    id: string;
    title: string;
    description: string;
    slug: string;
    base_price: number;
    cover_image: string;
    cover_image_file_id: string;
    rating_avg: number;
    rating_count: number;
    is_active: boolean;
    category_id: string;
    created_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    sku: string;
    size: string | null;
    color: string | null;
    price: number;
    stock: number;
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    file_id: string;
    sort_order: number;
}


export type Category = {
    id: string
    name: string
    slug: string
    image_url: string | null;
    image_file_id: string | null;
    sort_order: number
    is_active: boolean
    parent_id?: string
}

export type CategoryWithSubcategories = Category & {
    subcategories: Category[]
}

export interface Banner {
    id: string;
    image_url: string | null;
    image_file_id: string | null;
    link: string | null;
    sort_order: number;
    is_active: boolean;
    group_name: string;
    created_at: string;
}
