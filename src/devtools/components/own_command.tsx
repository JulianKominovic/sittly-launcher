import React, {
  createContext,
  forwardRef,
  useContext,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { cn, eventIsFromContextMenu, textContent } from "../lib/utils";
import {
  Virtuoso,
  VirtuosoGrid,
  VirtuosoGridHandle,
  VirtuosoHandle,
} from "react-virtuoso";
import { useServices } from "../hooks/context";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { ListItem } from "../types";
import { ExtensionNoResultItems } from "../types";

function shouldShowItem(item: ListItem) {
  return item.show === undefined ? true : item.show;
}

function filterNoResultItems(items: ListItem[]) {
  return items.filter(shouldShowItem);
}

/**
 * Filtering priority goes from cheapest to most expensive computation wise
 * 1. If not search is provided, return all items
 * 2. If the item has a `filteringText` prop, use that
 * 3. If the item has a `title` prop, use that
 * 4. If the item has a `description` prop, use that
 * 5. If the item has a `customChildren` prop, use that, this is the most expensive one, since it has to render the children and compute the textContent
 */
function filterItems<T extends ListItem>(items: T[], search: string) {
  if (!search) return items.filter(shouldShowItem);
  return items.filter((item) => {
    if (item.show !== undefined) return shouldShowItem(item);
    if (item.filteringText)
      return item.filteringText.toLowerCase().includes(search.toLowerCase());
    if (item.title?.toLowerCase().includes(search.toLowerCase())) return true;
    if (item.description?.toLowerCase().includes(search.toLowerCase()))
      return true;
    if (
      textContent(item.customChildren as any)
        .toLocaleLowerCase()
        .includes(search.toLowerCase())
    )
      return true;
    return false;
  });
}

const Empty = () => {
  return <div className="py-6 text-sm text-center">No results found</div>;
};

const Root = ({
  className,
  children,
  noResultItems,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  noResultItems: ExtensionNoResultItems;
} & React.HTMLProps<HTMLDivElement>) => {
  return (
    <ListContextProvider noResultItems={noResultItems}>
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md text-popover-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ListContextProvider>
  );
};

const List = ({
  items = [],
  id,
}: {
  items: ListItem[];
  /**
   *  You must provide an id to prevent unexpected behavior when the list is re-rendered
   */
  id: string;
} & React.HTMLProps<HTMLDivElement>) => {
  const ref = useRef<VirtuosoHandle>(null);
  const {
    searchbarText: _search,
    isContextMenuOpen,
    setContextMenuOptions,
    setMainActionLabel,
    isGlobalSearchEnable,
  } = useServices((state) => ({
    searchbarText: state.searchbarText,
    isContextMenuOpen: state.isContextMenuOpen,
    setContextMenuOptions: state.setContextMenuOptions,
    setMainActionLabel: state.setMainActionLabel,
    isGlobalSearchEnable: state.isGlobalSearchEnable,
  }));
  const location = useLocation();

  const search = useDeferredValue(_search);
  const { setCurrentItemIndex, currentItemIndex, noResultItems } =
    useContext(ListContext);

  const filteredItems = useDeepCompareMemo(() => {
    if (!isGlobalSearchEnable) return items;
    const filteredItems = filterItems(items, search);
    return filteredItems.length === 0
      ? filterNoResultItems(noResultItems())
      : filteredItems;
  }, [items, search, isGlobalSearchEnable]);

  const keyDownCallback = (e: KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown", "Enter"].includes(e.code)) return;
    // Ignore all events from the context menu
    if (eventIsFromContextMenu(e)) return;
    if (isContextMenuOpen) return;
    let nextIndex: number = currentItemIndex;

    if (e.code === "ArrowUp") {
      e.preventDefault();
      nextIndex = Math.max(0, currentItemIndex - 1);
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      nextIndex = Math.min(filteredItems.length - 1, currentItemIndex + 1);
    }
    if (e.code === "Enter") {
      filteredItems[currentItemIndex]?.onClick?.();
    }

    if (nextIndex !== null) {
      ref.current?.scrollIntoView({
        index: nextIndex,
        behavior: "auto",
      });

      setContextMenuOptions([]);
      filteredItems[nextIndex]?.onHighlight?.();
      setMainActionLabel(filteredItems[nextIndex]?.mainActionLabel ?? "");
      setCurrentItemIndex(nextIndex);
    }
  };

  useEffect(() => {
    filteredItems[0]?.onHighlight?.();
    setMainActionLabel(filteredItems[0]?.mainActionLabel ?? "");
    setCurrentItemIndex(0);
    ref.current?.scrollToIndex({
      index: 0,
      behavior: "auto",
      align: "center",
    });
  }, [location.pathname, filteredItems.length]);

  useEffect(() => {
    document.addEventListener("keydown", keyDownCallback);
    return () => {
      document.removeEventListener("keydown", keyDownCallback);
    };
  }, [keyDownCallback]);

  return (
    <Virtuoso
      key={id}
      className="mx-2 my-2"
      ref={ref}
      data={filteredItems}
      itemContent={(index, item) => {
        return (
          <Item
            {...item}
            // @ts-expect-error Private property
            displayType="LIST"
            key={(item.title as string) + index}
            index={index}
          />
        );
      }}
    />
  );
};

const Grid = ({
  items = [],
  columns = 4,
  id,
}: {
  items: ListItem[];
  columns: number;
  /**
   * You must provide an id to prevent unexpected behavior when the list is re-rendered
   * */
  id: string;
} & React.HTMLProps<HTMLDivElement>) => {
  const ref = useRef<VirtuosoGridHandle>(null);
  const {
    searchbarText: _search,
    isContextMenuOpen,
    setContextMenuOptions,
    setMainActionLabel,
    isGlobalSearchEnable,
  } = useServices((state) => ({
    searchbarText: state.searchbarText,
    isContextMenuOpen: state.isContextMenuOpen,
    setContextMenuOptions: state.setContextMenuOptions,
    setMainActionLabel: state.setMainActionLabel,
    isGlobalSearchEnable: state.isGlobalSearchEnable,
  }));
  const location = useLocation();
  const search = useDeferredValue(_search);
  const { setCurrentItemIndex, currentItemIndex, noResultItems } =
    useContext(ListContext);
  // mapExtensionsNoResultItems should be at the top level

  const { areFallbackItems, filteredItems } = useDeepCompareMemo(() => {
    if (!isGlobalSearchEnable)
      return { filteredItems: items, areFallbackItems: false };
    const filteredItems = filterItems(items, search);
    return {
      filteredItems:
        filteredItems.length === 0
          ? filterNoResultItems(noResultItems())
          : filteredItems,
      areFallbackItems: filteredItems.length === 0,
    };
  }, [items, search, isGlobalSearchEnable]);

  const keyDownCallback = (e: KeyboardEvent) => {
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(
        e.code
      )
    )
      return;
    // Ignore all events from the context menu
    if (eventIsFromContextMenu(e)) return;
    if (isContextMenuOpen) return;
    let nextIndex: number = currentItemIndex;

    if (e.code === "ArrowUp") {
      e.preventDefault();
      // If areFallbackItems, it's a list not a grid
      if (areFallbackItems) {
        nextIndex = Math.max(0, currentItemIndex - 1);
      } else {
        nextIndex = Math.max(0, currentItemIndex - columns);
      }
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      // If areFallbackItems, it's a list not a grid
      if (areFallbackItems) {
        nextIndex = Math.min(filteredItems.length - 1, currentItemIndex + 1);
      } else {
        nextIndex = Math.min(
          filteredItems.length - 1,
          currentItemIndex + columns
        );
      }
    }
    if (e.code === "ArrowLeft") {
      // If areFallbackItems, it's a list not a grid
      if (!areFallbackItems) nextIndex = Math.max(0, currentItemIndex - 1);
    }
    if (e.code === "ArrowRight") {
      // If areFallbackItems, it's a list not a grid
      if (!areFallbackItems)
        nextIndex = Math.min(filteredItems.length - 1, currentItemIndex + 1);
    }
    if (e.code === "Enter") {
      filteredItems[currentItemIndex]?.onClick?.();
    }

    ref.current?.scrollToIndex({
      index: nextIndex,
      behavior: "auto",
      align: "center",
    });
    setContextMenuOptions([]);
    filteredItems[nextIndex]?.onHighlight?.();
    setMainActionLabel(filteredItems[nextIndex]?.mainActionLabel ?? "");
    setCurrentItemIndex(nextIndex);
  };

  useEffect(() => {
    filteredItems[0]?.onHighlight?.();
    setMainActionLabel(filteredItems[0]?.mainActionLabel ?? "");
    setCurrentItemIndex(0);
    ref.current?.scrollToIndex({
      index: 0,
      behavior: "auto",
      align: "center",
    });
  }, [location.pathname, filteredItems.length]);

  useEffect(() => {
    document.addEventListener("keydown", keyDownCallback);
    return () => {
      document.removeEventListener("keydown", keyDownCallback);
    };
  }, [keyDownCallback]);

  return (
    <VirtuosoGrid
      key={id}
      className="mx-2 my-2"
      ref={ref}
      data={filteredItems}
      overscan={200}
      components={{
        List: forwardRef((props, ref) =>
          areFallbackItems ? (
            <div {...props} ref={ref} />
          ) : (
            <main
              ref={ref}
              {...props}
              style={{
                ...props.style,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
              }}
            />
          )
        ),
      }}
      itemContent={(index, item) => {
        return (
          <Item
            {...item}
            // @ts-expect-error Private property
            displayType={areFallbackItems ? "LIST" : "GRID"}
            className={clsx(
              areFallbackItems ? "" : "aspect-square h-auto max-h-64",
              item.className
            )}
            key={(item.title as string) + index}
            index={index}
          />
        );
      }}
    />
  );
};

const Item = ({
  className,
  description,
  icon,
  title,
  onClick,
  type,
  index,
  //@ts-expect-error private prop
  displayType,
  //@ts-expect-error private prop
  setCurrentItem,
  customChildren,
  onHighlight,
  rightIcon,
  ...props
}: {
  index: number;
} & React.HTMLProps<HTMLButtonElement> &
  ListItem) => {
  const { currentItemIndex, setCurrentItemIndex } = useContext(ListContext);
  return (
    <button
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none gap-2 rounded-lg w-full border border-transparent overflow-hidden object-cover",
        currentItemIndex === index
          ? "bg-opacity-5 bg-neutral-900 border border-neutral-300 dark:border-neutral-500 dark:bg-neutral-700"
          : "",
        displayType === "GRID"
          ? "flex-col items-start h-auto max-h-36"
          : customChildren
          ? "flex-row"
          : "flex-row h-11",
        className
      )}
      onClick={() => {
        onClick?.();
      }}
      onMouseEnter={() => {
        if (currentItemIndex === index) return;
        onHighlight?.();
        setCurrentItemIndex(index);
      }}
    >
      {customChildren ? (
        customChildren
      ) : (
        <>
          {icon && (
            <div
              className={clsx(
                "rounded-md text-[15px] overflow-hidden flex justify-center items-center",
                displayType === "GRID" ? "w-auto" : "w-7"
              )}
            >
              {icon}
            </div>
          )}
          {title || description ? (
            <div
              className={clsx(
                "flex flex-grow gap-2 w-4/5",
                displayType === "GRID"
                  ? "flex-col items-start"
                  : "flex-row items-center"
              )}
            >
              {title && (
                <div className="text-sm max-w-[20ch] min-w-fit text-left font-medium truncate text-foreground">
                  {title}
                </div>
              )}
              {description && (
                <div className="flex-shrink text-xs truncate text-muted-foreground dark:text-neutral-400">
                  {description}
                </div>
              )}
            </div>
          ) : null}
          {displayType === "LIST" && rightIcon}
        </>
      )}
    </button>
  );
};

const Input = forwardRef(
  (
    {
      className,
      ...props
    }: { className?: string } & React.HTMLProps<HTMLInputElement>,
    ref
  ) => {
    const { searchbarText: search, setSearchbarText: setSearch } =
      useServices();
    const { setCurrentItemIndex } = useContext(ListContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    return (
      <div className="flex items-center gap-2 border-b dark:border-neutral-600">
        {pathname !== "/" && (
          <button
            className="flex items-center justify-center px-2 py-1 ml-2 bg-transparent rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-foreground"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IoMdArrowBack />
          </button>
        )}
        <input
          ref={ref as any}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentItemIndex(0);
          }}
          value={search}
          className={cn(
            "flex h-11 w-full bg-transparent py-2 px-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-100 dark:placeholder:text-neutral-400",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

const ListContext = createContext<{
  currentItemIndex: number;
  setCurrentItemIndex: React.Dispatch<React.SetStateAction<number>>;
  noResultItems: ExtensionNoResultItems;
}>({
  currentItemIndex: 0,
  setCurrentItemIndex: () => {},
  noResultItems: () => [],
} as any);

const ListContextProvider = ({
  children,
  noResultItems,
}: {
  children: React.ReactNode;
  noResultItems: ExtensionNoResultItems;
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  return (
    <ListContext.Provider
      value={{ currentItemIndex, setCurrentItemIndex, noResultItems }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default {
  Root,
  Input,
  // Group,
  Grid,
  List,
  Item,
  Empty,
};
