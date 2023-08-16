import React, { useId } from "react";

export default function ({ keys }: { keys: string[] }) {
  const id = useId();
  return (
    <div className="flex gap-1">
      {keys.map((key) => (
        <kbd
          key={id + key}
          className="pointer-events-none rounded-sm inline-flex h-5 select-none items-center gap-1 align-middle border bg-neutral-300 border-neutral-300 px-1.5 text-[10px]  text-neutral-900 bg-opacity-30 font-sans"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
