"use client";
import { BannerRow } from "@/components/banner/banner-row";
import { CreateBannerDialog } from "@/components/banner/create-banner-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api/client";
import { Banner } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface BannersResponse {
  banners: Banner[];
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
  { value: "group_name", label: "Group A-Z & Order ↓" },
];

export default function BannersPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [isActiveFilter, setIsActiveFilter] = useState("");

  const params: Record<string, string | number> = { page, limit: 10, sort };
  if (isActiveFilter) params.is_active = isActiveFilter;

  const { data, isPending } = useQuery({
    queryKey: ["banners", params],
    queryFn: async () => {
      const res = await apiClient.get<BannersResponse>("/admin/banners", {
        params,
      });
      return res.data;
    },
  });

  const banners = data?.banners ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <CreateBannerDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v ? v : "newest");
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
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No banners found.
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <BannerRow key={banner.id} banner={banner} />
          ))}
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {Math.min(
              (pagination.page - 1) * pagination.limit + 1,
              pagination.total,
            )}
            –{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} banners
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
