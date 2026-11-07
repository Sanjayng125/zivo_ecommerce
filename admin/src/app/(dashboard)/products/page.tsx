"use client";
import { InfiniteCategorySelect } from "@/components/infinite-category-select";
import { DeleteProductModal } from "@/components/product/DeleteProductModal";
import ToggleIsActive from "@/components/product/ToggleIsActive";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api/client";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function ProductsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const debounce = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
    setPage(1);
  }, 400);

  function handleSearch(val: string) {
    setSearch(val);
    debounce(val.length > 2 ? val : "");
  }

  function clearSearch() {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  }

  const params: Record<string, string | number> = {
    page,
    limit: 20,
    sort,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (isActiveFilter) params.is_active = isActiveFilter;
  if (selectedCategoryId) params.category_id = selectedCategoryId;

  const { data, isPending } = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await apiClient.get<ProductsResponse>("/admin/products", {
        params,
      });
      return res.data;
    },
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Select
          value={sort}
          onValueChange={(v) => {
            if (v !== null) setSort(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={isActiveFilter || "all"}
          onValueChange={(v) => {
            setIsActiveFilter(v === "all" || v === null ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <InfiniteCategorySelect
          value={selectedCategoryId}
          onChange={(val) => setSelectedCategoryId(val ? val : "")}
        />
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.cover_image ? (
                      <div className="w-10 h-10 relative rounded-md overflow-hidden border">
                        <Image
                          src={product.cover_image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md border bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="max-w-72 overflow-hidden">
                    <div className="font-medium line-clamp-1 truncate">
                      {product.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {product.slug}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{product.base_price.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">
                      ⭐ {Number(product.rating_avg).toFixed(1)}
                      <span className="text-muted-foreground ml-1">
                        ({product.rating_count})
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <ToggleIsActive product={product} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          router.push(`/products/${product.slug}/edit`)
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <DeleteProductModal product={product} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {Math.min(
              (pagination.page - 1) * pagination.limit + 1,
              pagination.total,
            )}
            –{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page === pagination.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
