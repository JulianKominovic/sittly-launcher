import clsx from "clsx";
import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className,
        "w-full h-11 bg-gray-200 rounded-md dark:bg-gray-700 flex animate-pulse"
      )}
    />
  );
}
export function ListSkeleton() {
  return (
    <div className="px-2 pt-2 space-y-2">
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
