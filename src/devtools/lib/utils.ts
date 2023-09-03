import { type ClassValue, clsx } from "clsx";
import { time } from "console";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Traverse any props.children to get their combined text content.
 *
 * This does not add whitespace for readability: `<p>Hello <em>world</em>!</p>`
 * yields `Hello world!` as expected, but `<p>Hello</p><p>world</p>` returns
 * `Helloworld`, just like https://mdn.io/Node/textContent does.
 *
 * NOTE: This may be very dependent on the internals of React.
 */
export function textContent(elem: React.ReactElement | string): string {
  if (!elem) {
    return "";
  }
  if (typeof elem === "string") {
    return elem;
  }
  // Debugging for basic content shows that props.children, if any, is either a
  // ReactElement, or a string, or an Array with any combination. Like for
  // `<p>Hello <em>world</em>!</p>`:
  //
  //   $$typeof: Symbol(react.element)
  //   type: "p"
  //   props:
  //     children:
  //       - "Hello "
  //       - $$typeof: Symbol(react.element)
  //         type: "em"
  //         props:
  //           children: "world"
  //       - "!"
  const children = elem.props && elem.props.children;
  if (children instanceof Array) {
    return children.map(textContent).join("");
  }
  return textContent(children);
}

export const eventIsFromContextMenu = (event: KeyboardEvent) => {
  return (event.target as HTMLInputElement).attributes.getNamedItem(
    "data-is-context-menu"
  );
};

export const urlUtils = {
  isGithubUrl: (url: string) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === "github.com";
    } catch (err) {
      return false;
    }
  },
};

export function useDebounceFunction(delay: number) {
  const timeoutId = useRef<number | null>(null);
  const [init, setInit] = useState(() => () => {});
  const debounce = (callback: () => any) => {
    setInit(() => callback);
  };

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(init, delay) as any;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId.current as any);
      }
    };
  }, [init]);

  return {
    debounce,
  };
}
