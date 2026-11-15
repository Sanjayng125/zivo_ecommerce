"use client";
import { CategoryRow } from "@/components/category/category-row";
import { CreateCategoryDialog } from "@/components/category/create-category-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api/client";
import { CategoryWithSubcategories } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface CategoriesResponse {
  categories: CategoryWithSubcategories[];
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
  { value: "sort_order_asc", label: "Sort Order ↑" },
  { value: "sort_order_desc", label: "Sort Order ↓" },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isActiveFilter, setIsActiveFilter] = useState("");

  const debounce = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 400);

  function handleSearch(val: string) {
    setSearch(val);
    debounce(val);
  }

  function clearSearch() {
    setSearch("");
    setDebouncedSearch("");
  }

  const params: Record<string, string | number> = {
    limit: 30,
    sort,
  };
  if (debouncedSearch) params.q = debouncedSearch;
  if (isActiveFilter) params.is_active = isActiveFilter;

  const { data, isPending } = useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const res = await apiClient.get<CategoriesResponse>("/admin/categories", {
        params,
      });
      return res.data;
    },
  });

  const categories = data?.categories ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CreateCategoryDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
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
          onValueChange={(v) => setSort(v === null ? "newest" : v)}
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
          onValueChange={(v) =>
            setIsActiveFilter(v === "all" || v === null ? "" : v)
          }
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
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No categories found.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
