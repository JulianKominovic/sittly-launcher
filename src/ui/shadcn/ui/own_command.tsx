import React, {
  createContext,
  forwardRef,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn, textContent } from "../../../lib/utils";
import {
  Virtuoso,
  VirtuosoGrid,
  VirtuosoGridHandle,
  VirtuosoHandle,
} from "react-virtuoso";
import { useServices } from "../../../services";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { mapExtensionsNoResultItems } from "../../../extensions/extension-assembly";

/**
 * Filtering priority goes from cheapest to most expensive computation wise
 * 1. If not search is provided, return all items
 * 2. If the item has a `filteringText` prop, use that
 * 3. If the item has a `title` prop, use that
 * 4. If the item has a `description` prop, use that
 * 5. If the item has a `customChildren` prop, use that, this is the most expensive one, since it has to render the children and compute the textContent
 */
function filterItems<T extends ListItem>(items: T[], search: string) {
  if (!search) return items;
  return items.filter((item) => {
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

export type ListItem = {
  /**
   * The title of the item
   *
   * Ignore this prop if you are using `customChildren`
   */
  title?: string;
  /**
   * The description of the item
   *
   * Ignore this prop if you are using `customChildren`
   */
  description?: string;
  /**
   * The icon of the item
   *
   * Ignore this prop if you are using `customChildren`
   */
  icon?: React.ReactNode;
  /**
   * When the item is clicked or selected via keyboard
   *
   */
  onClick: () => void;
  /**
   * If you want to use a custom component as the item
   *
   * If you are using this prop, you should ignore `title`, `description` and `icon`. They won't work.
   *
   * I encourage you to use `filteringText` if you are using this prop because search bar won't work unless you have text inside the `customChildren`
   */
  customChildren?: React.ReactNode;
  /**
   * The class name will be passed to button element
   */
  className?: string;
  /**
   * When the item is highlighted via keyboard or mouse hover.
   *
   */
  onHighlight?: () => void;
  /**
   * In case you want to specify a filtering text that is different from the title, description or `customChildren`.
   *
   * If you are using `customChildren`, you should use this prop.
   *
   * This prop is used for filtering the items when the user types in the search bar
   */
  filteringText?: string;
};

const Empty = () => {
  return <div className="py-6 text-sm text-center">No results found</div>;
};

const Root = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>) => {
  return (
    <ListContextProvider>
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
  const _search = useServices((state) => state.searchbarText);
  const search = useDeferredValue(_search);
  const { setCurrentItemIndex, currentItemIndex } = useContext(ListContext);
  const noResultItems = mapExtensionsNoResultItems();
  const filteredItems = useMemo(() => {
    const filteredItems = filterItems(items, search);
    return filteredItems.length === 0 ? noResultItems : filteredItems;
  }, [items, search]);

  const contextMenuIsOpen = useServices((state) => state.contextMenuIsOpen);
  const keyDownCallback = (e: KeyboardEvent) => {
    // Ignore all events from the context menu
    if (
      (e.target as HTMLInputElement).attributes.getNamedItem(
        "data-is-context-menu"
      )
    )
      return;
    if (contextMenuIsOpen) return;
    let nextIndex: number = currentItemIndex;

    if (e.code === "ArrowUp") {
      nextIndex = Math.max(0, currentItemIndex - 1);
    }
    if (e.code === "ArrowDown") {
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
      setCurrentItemIndex(nextIndex);
    }
  };
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
            //@ts-expect-error private prop
            displayType="LIST"
            key={item.title + index}
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
  const _search = useServices((state) => state.searchbarText);
  const search = useDeferredValue(_search);
  const { setCurrentItemIndex, currentItemIndex } = useContext(ListContext);
  const noResultItems = mapExtensionsNoResultItems();
  const { areFallbackItems, filteredItems } = useMemo(() => {
    const filteredItems = filterItems(items, search);
    return {
      filteredItems: filteredItems.length === 0 ? noResultItems : filteredItems,
      areFallbackItems: filteredItems.length === 0,
    };
  }, [items, search]);
  const contextMenuIsOpen = useServices((state) => state.contextMenuIsOpen);

  const keyDownCallback = (e: KeyboardEvent) => {
    // Ignore all events from the context menu
    if (
      (e.target as HTMLInputElement).attributes.getNamedItem(
        "data-is-context-menu"
      )
    )
      return;
    if (contextMenuIsOpen) return;
    let nextIndex: number = currentItemIndex;

    if (e.code === "ArrowUp") {
      nextIndex = Math.max(0, currentItemIndex - columns);
    }
    if (e.code === "ArrowDown") {
      nextIndex = Math.min(
        filteredItems.length - 1,
        currentItemIndex + columns
      );
    }
    if (e.code === "ArrowLeft") {
      nextIndex = Math.max(0, currentItemIndex - 1);
    }
    if (e.code === "ArrowRight") {
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
    setCurrentItemIndex(nextIndex);
  };

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
            //@ts-expect-error private prop
            displayType={areFallbackItems ? "LIST" : "GRID"}
            className={clsx(
              areFallbackItems ? "" : "aspect-square h-auto",
              item.className
            )}
            key={item.title + index}
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
  ...props
}: {
  index: number;
} & React.HTMLProps<HTMLButtonElement> &
  ListItem) => {
  const { currentItemIndex, setCurrentItemIndex } = useContext(ListContext);
  useEffect(() => {
    if (!onHighlight) return;
    if (currentItemIndex === index) {
      onHighlight();
    }
  }, [currentItemIndex, onHighlight]);
  return (
    <button
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2 rounded-lg w-full",
        currentItemIndex === index ? "bg-neutral-200" : "",
        displayType === "GRID"
          ? "flex-col items-start h-auto"
          : "flex-row  h-9",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => {
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
                "rounded-md",
                displayType === "GRID" ? "w-auto" : "w-5 "
              )}
            >
              {icon}
            </div>
          )}
          {title || description ? (
            <div
              className={clsx(
                "flex  flex-grow gap-2",
                displayType === "GRID"
                  ? "flex-col items-start"
                  : "flex-row items-center"
              )}
            >
              {title && (
                <div className="text-sm font-medium text-foreground">
                  {title}
                </div>
              )}
              {description && (
                <div className="text-xs text-muted-foreground">
                  {description}
                </div>
              )}
            </div>
          ) : null}
          {displayType === "LIST" && (
            <div>
              <LightningBoltIcon />
            </div>
          )}
        </>
      )}
    </button>
  );
};

const Input = forwardRef(
  (
    {
      className,
      onKeyDown,
      ...props
    }: { className?: string } & React.HTMLProps<HTMLInputElement>,
    ref
  ) => {
    const { _search, setSearch } = useServices((state) => ({
      _search: state.searchbarText,
      setSearch: state.setSearchbarText,
    }));
    const search = useDeferredValue(_search);
    const { setCurrentItemIndex } = useContext(ListContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
      <div className="flex items-center gap-2">
        {pathname !== "/" && (
          <button
            className="flex items-center justify-center px-2 py-1 mx-2 rounded-lg bg-neutral-200 text-neutral-foreground"
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
            "flex h-11 w-full bg-transparent py-2 px-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-b",
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
}>({
  currentItemIndex: 0,
  setCurrentItemIndex: () => {},
} as any);

const ListContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  return (
    <ListContext.Provider value={{ currentItemIndex, setCurrentItemIndex }}>
      {children}
    </ListContext.Provider>
  );
};

export const SittlyCommand = {
  Root,
  Input,
  // Group,
  Grid,
  List,
  Item,
  Empty,
};
