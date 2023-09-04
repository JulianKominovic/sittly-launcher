import clsx from "clsx";
import React from "react";

export function Skeleton({
  className,
  ...rest
}: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        className,
        "w-full h-11 bg-gray-200 rounded-md dark:bg-gray-700 flex animate-pulse"
      )}
      {...rest}
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
