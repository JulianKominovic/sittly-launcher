import React, { useEffect, useRef } from "react";
import Command from "./ui/Command";
import Footer from "./ui/Footer";
import { registerMusicListener } from "./services/music";
import { Route, Routes, useNavigate } from "react-router-dom";

import {
  mapExtensionsContextMenuItems,
  mapExtensionsItems,
  mapExtensionsPages,
} from "./extensions/extension-assembly";
import sittlyDevtools from "./devtools/index";
import { ListItem } from "./devtools/types";
import { AsyncStatusEvent, SittlyCustomEvents } from "./devtools/types/events";
import { hideApp } from "./devtools/api/app";

const { hooks, components, utils } = sittlyDevtools;
const { Command: SittlyCommand } = components;
const { useRouter, useServices } = hooks;
const { eventIsFromContextMenu } = utils;

const EventsRegister = () => {
  const {
    setMusic,
    setInitialContextMenuOptions,
    isContextMenuOpen,
    setContextMenuOptions,
    setSearchbarText,
    setContextMenuIsOpen,
    setAsyncOperation,
    searchbarText,
  } = useServices((state) => ({
    setMusic: state.setMusic,
    setInitialContextMenuOptions: state.setInitialContextMenuOptions,
    isContextMenuOpen: state.isContextMenuOpen,
    setContextMenuIsOpen: state.setContextMenuIsOpen,
    setContextMenuOptions: state.setContextMenuOptions,
    setSearchbarText: state.setSearchbarText,
    setAsyncOperation: state.setAsyncOperation,
    searchbarText: state.searchbarText,
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
      if (searchbarText !== "") return setSearchbarText("");
      if (location.pathname === "/") return hideApp();
      goBack();
    }
  };
  const handleContextMenuChange = (e: MouseEvent) => {
    setContextMenuIsOpen(true);
    e.preventDefault();
  };
  const handleAsyncStatusEvent = ({
    detail,
  }: CustomEvent<AsyncStatusEvent>) => {
    setAsyncOperation(detail);
  };
  const initialContextMenuOptions = mapExtensionsContextMenuItems();
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);
  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenuChange);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenuChange);
    };
  }, [handleContextMenuChange]);

  useEffect(() => {
    setContextMenuOptions([]);
    setSearchbarText("");
  }, [location.pathname]);
  useEffect(() => {
    const unlisten = registerMusicListener(setMusic);
    setInitialContextMenuOptions(initialContextMenuOptions);

    window.addEventListener(
      SittlyCustomEvents.ASYNC_STATUS,
      handleAsyncStatusEvent as any
    );

    return () => {
      window.removeEventListener(
        SittlyCustomEvents.ASYNC_STATUS,
        handleAsyncStatusEvent as any
      );
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
        mainActionLabel: "Go to " + page.name,
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
              <SittlyCommand.List
                key="index-commands"
                id="index-commands"
                items={indexItems}
              />
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
