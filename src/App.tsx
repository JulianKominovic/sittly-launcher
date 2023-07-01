import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Music from "./modes/Music";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";

const list = {
  hover: { height: 160, width: "100%" },
  // initial: { scale: 1, height: 150, width: "100%" },
  initial: { scale: 0 },
  animate: { scale: 1 },
};

const item = {
  hover: { scale: 1 },
  initial: { scale: 0 },
  // initial: { scale: 1 },
};

const App = () => {
  const [currentSeconds, setCurrentSeconds] = useState(0);
  useEffect(() => {
    listen("player_status", (event) => {
      console.log(event);
    });
  }, []);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={list}
      transition={{
        type: "spring",
        stiffness: 100,
        bounce: 0.05,
        mass: 0.5,
        velocity: 2,
      }}
      className="w-40 h-8 mx-auto bg-black rounded-3xl"
    >
      <motion.main
        className="w-full h-full px-4 py-2"
        variants={item}
        transition={{
          velocity: 4,
        }}
      >
        <Music
          artist="The Weeknd"
          name="Blinding Lights"
          onSlide={(value) => {
            setCurrentSeconds(value);
          }}
          onPlayPause={() => {
            invoke("play_pause_music");
          }}
          currentSeconds={currentSeconds}
          totalSeconds={300}
        />
      </motion.main>
    </motion.div>
  );
};

export default App;
