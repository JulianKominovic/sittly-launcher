import { pasteToCurrentWindow } from "../../services/clipboard";
import { ExtensionItems } from "../../types/extensions";
import * as unicodeEmoji from "unicode-emoji";
import { useState } from "react";
const emojis = unicodeEmoji.getEmojis();

const items: () => ExtensionItems = () => {
  const [a, setA] = useState("a");
  return emojis.map((emoji) => {
    return {
      onClick() {
        pasteToCurrentWindow(a.toString());
      },
      customChildren: <div key={emoji.emoji}>{emoji.emoji}</div>,
    };
  });
};
export default items;
