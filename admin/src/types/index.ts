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


export type Category = {
    id: string
    name: string
    slug: string
    image_url: string | null
    sort_order: number
}

export type CategoryWithParent = Category & {
    parent_id: string
}

export type CategoryWithSubcategories = Category & {
    subcategories: CategoryWithParent[]
}
