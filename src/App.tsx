import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api";
import { listen, once, UnlistenFn } from "@tauri-apps/api/event";
import { BsApp, BsMusicNote } from "react-icons/bs";
import Command from "./ui/Command";
import Footer from "./ui/Footer";
import { registerMusicListener } from "./services/music";
import { useServices } from "./services";
import MainActivity from "./ui/MainActivity";

const EventsRegister = () => {
  const { setMusic } = useServices((state) => ({
    setMusic: state.setMusic,
  }));
  useEffect(() => {
    const unlisten = registerMusicListener(setMusic);
    return () => {
      unlisten.then((unlisten) => unlisten());
    };
  }, []);
  return null;
};

const App = () => {
  const commandRefInput = useRef<HTMLInputElement>(null);

  console.log("RENDER MAIN");
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Command ref={commandRefInput}>{/* <MainActivity /> */}</Command>
      <Footer commandRefInput={commandRefInput} />
      <EventsRegister />
    </div>
  );
};

export default App;
