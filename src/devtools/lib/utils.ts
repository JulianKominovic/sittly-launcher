import { type ClassValue, clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
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

export function groupBy<T, K extends keyof any>(xs: T[], getKey: (i: T) => K) {
  return xs.reduce((r, x) => {
    let key = getKey(x);
    r[key] = [...(r[key] || []), x];
    return r;
  }, {} as Record<K, T[]>);
}

export * as validator from "validator";
export const isDate = (date: number | string) => {
  try {
    return !isNaN(new Date(date).getTime());
  } catch (err) {
    return false;
  }
};
/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
): string {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    return { header, payload };
  } catch (err) {
    return null;
  }
}
