import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api";
import { listen, once, UnlistenFn } from "@tauri-apps/api/event";
import { BsApp, BsMusicNote } from "react-icons/bs";
import Command from "./ui/Command";
import Footer from "./ui/Footer";
import { registerMusicListener } from "./services/music";
import { useServices } from "./services";
import MainActivity from "./ui/MainActivity";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ListItem, SittlyCommand } from "./ui/shadcn/ui/own_command";

const EventsRegister = () => {
  const { setMusic } = useServices((state) => ({
    setMusic: state.setMusic,
  }));
  const navigate = useNavigate();
  const goBack = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      navigate(-1);
    }
  };
  useEffect(() => {
    const unlisten = registerMusicListener(setMusic);
    window.addEventListener("keydown", goBack);
    return () => {
      unlisten.then((unlisten) => unlisten());
      window.removeEventListener("keydown", goBack);
    };
  }, []);
  return null;
};

const { pages: assemblyPages, items: assemblyItems } = await import(
  "./extensions/extension-assembly"
);
const awaitedPages = await Promise.all(assemblyPages);
const mappedPages = awaitedPages.flatMap((page) => {
  return page.default.map((page) => {
    return page;
  });
});

const awaitedItems = await Promise.all(assemblyItems);
console.log(awaitedItems);

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
    .concat(mappedItems);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Command ref={commandRefInput}>
        <Routes>
          <Route path="/" element={<SittlyCommand.List items={indexItems} />} />
          {mappedPages.map((page) => {
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
