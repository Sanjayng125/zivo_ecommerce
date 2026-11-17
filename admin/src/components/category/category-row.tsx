"use client";
import { CategoryWithSubcategories } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CreateCategoryDialog } from "./create-category-dialog";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { EditCategoryDialog } from "./edit-category-dialog";
import ToggleIsActive from "./ToggleIsActive";

export function CategoryRow({
  category,
}: {
  category: CategoryWithSubcategories;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasSubcategories = category.subcategories?.length > 0;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center gap-3 p-3 bg-background hover:bg-muted/50 transition-colors">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground shrink-0"
          disabled={!hasSubcategories}
        >
          {hasSubcategories ? (
            expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4" />
          )}
        </button>

        <div className="w-10 h-10 flex justify-center items-center rounded-md border bg-muted shrink-0 overflow-hidden relative">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover"
            />
          ) : (
            <p>{category.name.charAt(0).toUpperCase()}</p>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{category.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {category.slug}
            {hasSubcategories && (
              <span className="ml-2">
                · {category.subcategories.length} sub
                {category.subcategories.length > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        <span className="text-xs text-muted-foreground hidden sm:block shrink-0">
          #{category.sort_order}
        </span>

        <ToggleIsActive category={category} />

        <div className="flex items-center gap-1 shrink-0">
          <CreateCategoryDialog parentCategory={category} />
          <EditCategoryDialog category={category} />
          <DeleteCategoryModal category={category} />
        </div>
      </div>

      {expanded && hasSubcategories && (
        <div className="border-t divide-y bg-muted/20">
          {category.subcategories.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-3 p-3 pl-10 hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 flex justify-center items-center rounded-md border bg-muted shrink-0 overflow-hidden relative">
                {sub.image_url ? (
                  <Image
                    src={sub.image_url}
                    alt={sub.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <p>{sub.name.charAt(0).toUpperCase()}</p>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{sub.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {sub.slug}
                </p>
              </div>

              <span className="text-xs text-muted-foreground hidden sm:block shrink-0">
                #{sub.sort_order}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <EditCategoryDialog category={sub} />
                <DeleteCategoryModal category={sub} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
