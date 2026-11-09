"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";

interface InfiniteCategorySelectProps {
  value: string;
  onChange: (value: string | null) => void;
}

export function InfiniteCategorySelect({
  value,
  onChange,
}: InfiniteCategorySelectProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: categories,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const options = categories.flatMap((cat) => [
    { ...cat, indent: false },
    ...cat.subcategories.map((sub) => ({
      ...sub,
      indent: true,
    })),
  ]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <Label>
          {selectedCategory
            ? selectedCategory.name
            : value
              ? value
              : "Select Category"}
        </Label>
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <SelectItem onClick={() => setSelectedCategory(null)} value={null}>
              Clear
            </SelectItem>
            {options.map((cat) => (
              <SelectItem
                key={cat.id}
                value={cat.id}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.indent ? `↳ ${cat.name}` : cat.name}
              </SelectItem>
            ))}

            <div ref={bottomRef} className="py-1">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
