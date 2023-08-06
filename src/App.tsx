import React, { useEffect, useRef } from "react";
import Command from "./ui/Command";
import Footer from "./ui/Footer";
import { registerMusicListener } from "./services/music";
import { useServices } from "./services";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ListItem, SittlyCommand } from "./ui/shadcn/ui/own_command";
import { useRouter } from "./services/router";

const {
  pages: assemblyPages,
  items: assemblyItems,
  contextMenuItems: assemblyContextMenuItems,
} = await import("./extensions/extension-assembly");
const awaitedPages = await Promise.all(assemblyPages);
const mappedPages = awaitedPages.flatMap((page) => {
  return page.default.map((page) => {
    return page;
  });
});

const awaitedItems = await Promise.all(assemblyItems);
const awaitedContextMenuItems = await Promise.all(assemblyContextMenuItems);

const EventsRegister = () => {
  const { setMusic, setInitialContextMenuOptions } = useServices((state) => ({
    setMusic: state.setMusic,
    setInitialContextMenuOptions: state.setInitialContextMenuOptions,
  }));
  const { goBack } = useRouter();

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      goBack();
    }
  };
  const initialContextMenuOptions = awaitedContextMenuItems.flatMap((item) => {
    return item.default().map((item) => {
      return item;
    });
  });
  useEffect(() => {
    const unlisten = registerMusicListener(setMusic);
    setInitialContextMenuOptions(initialContextMenuOptions);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      unlisten.then((unlisten) => unlisten());
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  return null;
};

const App = () => {
  const commandRefInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  console.log("RENDER MAIN");

  const mappedItems = awaitedItems.flatMap((item) => {
    return item.default().map((item) => {
      return item;
    });
  });
  const indexItems: ListItem[] = mappedPages
    .map((page) => {
      return {
        title: page.name,
        description: page.description,
        icon: page.icon,
        onClick: () => {
          navigate(page.route);
        },
      };
    })
    .concat(mappedItems as any);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Command ref={commandRefInput}>
        <Routes>
          <Route path="/" element={<SittlyCommand.List items={indexItems} />} />
          {mappedPages.map((page) => {
            //@ts-expect-error I don't know how to fix this
            return <Route path={page.route} element={<page.component />} />;
          })}
        </Routes>
      </Command>
      <Footer commandRefInput={commandRefInput} />
      <EventsRegister />
    </div>
  );
};

export default App;
