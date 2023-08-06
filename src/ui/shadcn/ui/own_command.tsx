import React, {
  createContext,
  forwardRef,
  ReactComponentElement,
  ReactHTML,
  ReactHTMLElement,
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
  VirtuosoProps,
} from "react-virtuoso";
import { AuxActions } from "../../../types/extensions";
import { useServices } from "../../../services";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import {
  useLocation,
  useMatch,
  useNavigate,
  useNavigation,
  useNavigationType,
} from "react-router-dom";
import { BsBack, BsSkipBackward } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";
import { SkipBack } from "lucide-react";

function filterItems<T extends ListItem>(items: T[], search: string) {
  return items.filter((item) => {
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
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionName?: string;
  onClick: () => void;
  customChildren?: React.ReactNode;
  className?: string;
  onHighlight?: () => void;
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
  className,
  items = [],
  ...props
}: {
  className?: string;
  items: ListItem[];
} & React.HTMLProps<HTMLDivElement>) => {
  const ref = useRef<VirtuosoHandle>(null);
  const { setCurrentItemIndex, currentItemIndex, search } =
    useContext(ListContext);
  const filteredItems = useMemo(
    () => filterItems(items, search),
    [items, search]
  );
  const contextMenuIsOpen = useServices((state) => state.contextMenuIsOpen);
  const keyDownCallback = React.useCallback(
    (e: KeyboardEvent) => {
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
    },
    [currentItemIndex, ref, setCurrentItemIndex, contextMenuIsOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownCallback);
    return () => {
      document.removeEventListener("keydown", keyDownCallback);
    };
  }, [currentItemIndex, contextMenuIsOpen]);

  return (
    <Virtuoso
      className="mx-2"
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
  className,
  items = [],
  columns = 4,
  ...props
}: {
  className?: string;
  items: ListItem[];
  columns: number;
} & React.HTMLProps<HTMLDivElement>) => {
  const ref = useRef<VirtuosoGridHandle>(null);
  const { setCurrentItemIndex, currentItemIndex, search } =
    useContext(ListContext);
  const filteredItems = useMemo(
    () => filterItems(items, search),
    [items, search]
  );
  const contextMenuIsOpen = useServices((state) => state.contextMenuIsOpen);

  const keyDownCallback = React.useCallback(
    (e: KeyboardEvent) => {
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

      if (nextIndex !== null) {
        ref.current?.scrollToIndex({
          index: nextIndex,
          behavior: "auto",
          align: "center",
        });
        setCurrentItemIndex(nextIndex);
      }
    },
    [currentItemIndex, ref, setCurrentItemIndex, columns, contextMenuIsOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyDownCallback);
    return () => {
      document.removeEventListener("keydown", keyDownCallback);
    };
  }, [currentItemIndex, contextMenuIsOpen]);
  return (
    <VirtuosoGrid
      className="mx-2"
      ref={ref}
      data={filteredItems}
      components={{
        List: forwardRef((props, ref) => (
          <main
            ref={ref}
            {...props}
            style={{
              ...props.style,
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          />
        )),
      }}
      itemContent={(index, item) => {
        return (
          <Item
            {...item}
            //@ts-expect-error private prop
            displayType="GRID"
            className={clsx("aspect-square h-auto", item.className)}
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
  actionName,
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
    const { search, setSearch, setCurrentItemIndex } = useContext(ListContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    return (
      <div className="flex items-center gap-2">
        {pathname !== "/" && (
          <button
            className="flex items-center justify-center px-2 py-1 mx-2 rounded-full bg-neutral-200 text-neutral-foreground"
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
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}>({
  currentItemIndex: 0,
  setCurrentItemIndex: () => {},
  search: "",
  setSearch: () => {},
} as any);

const ListContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const [_search, setSearch] = useState("");
  const search = useDeferredValue(_search);

  return (
    <ListContext.Provider
      value={{ currentItemIndex, setCurrentItemIndex, search, setSearch }}
    >
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
