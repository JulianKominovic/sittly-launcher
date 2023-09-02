import React from "react";

type LayoutProps = {
  direction?: "column" | "row";
  proportions?: "50/50" | "25/75" | "75/25";
  children: React.ReactNode;
};
export default function Layout({
  direction = "column",
  proportions = "50/50",
  children,
}: LayoutProps) {
  if (direction === "column") {
    if (proportions === "50/50") {
      return (
        <div className="grid h-full grid-cols-2 grid-rows-1 ">{children}</div>
      );
    }
    if (proportions === "25/75") {
      return (
        <div className="grid h-full grid-cols-4 grid-rows-1 ">{children}</div>
      );
    }
    if (proportions === "75/25") {
      return (
        <div className="grid h-full grid-cols-4 grid-rows-1 ">{children}</div>
      );
    }
  }
  if (direction === "row") {
    if (proportions === "50/50") {
      return (
        <div className="grid h-full grid-cols-1 grid-rows-2 ">{children}</div>
      );
    }
    if (proportions === "25/75") {
      return (
        <div className="grid h-full grid-cols-1 grid-rows-2 ">{children}</div>
      );
    }
    if (proportions === "75/25") {
      return (
        <div className="grid h-full grid-cols-1 grid-rows-2 ">{children}</div>
      );
    }
  }
  return children as any;
}
