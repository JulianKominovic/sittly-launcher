import React, { useEffect, useRef } from "react";
import Command from "./ui/Command";
import Footer from "./ui/Footer";
import { registerMusicListener } from "./services/music";
import { useServices } from "./@devtools/hooks/context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { SittlyCommand } from "./@devtools/components/own_command";
import { useRouter } from "./@devtools/hooks/router";

import {
  mapExtensionsContextMenuItems,
  mapExtensionsItems,
  mapExtensionsPages,
} from "./extensions/extension-assembly";
import { eventIsFromContextMenu } from "./@devtools/lib/utils";
import { appWindow } from "@tauri-apps/api/window";
import { ListItem } from "./@devtools/types";

const EventsRegister = () => {
  const { setMusic, setInitialContextMenuOptions, isContextMenuOpen } =
    useServices((state) => ({
      setMusic: state.setMusic,
      setInitialContextMenuOptions: state.setInitialContextMenuOptions,
      isContextMenuOpen: state.isContextMenuOpen,
    }));
  const { goBack, location } = useRouter();

  //@ts-ignore
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      if (eventIsFromContextMenu(e)) return;
      if (isContextMenuOpen) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (location.pathname === "/") return appWindow.hide();
      goBack();
    }
  };
  const initialContextMenuOptions = mapExtensionsContextMenuItems();
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);
  useEffect(() => {
    const unlisten = registerMusicListener(setMusic);
    setInitialContextMenuOptions(initialContextMenuOptions);

    return () => {
      unlisten.then((unlisten) => unlisten());
    };
  }, []);
  return null;
};

const App = () => {
  const commandRefInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  console.log("RENDER MAIN");
  const mappedPages = mapExtensionsPages();
  const mappedItems = mapExtensionsItems();
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
          <Route
            path="/"
            element={
              <SittlyCommand.List id="index-commands" items={indexItems} />
            }
          />
          {mappedPages.map((page) => {
            return (
              <Route
                key={page.route}
                path={page.route}
                element={<page.component />}
              />
            );
          })}
        </Routes>
      </Command>
      <Footer commandRefInput={commandRefInput} />
      <EventsRegister />
    </div>
  );
};

export default App;
