import { BaseModule } from "./base";
import * as unicodeEmoji from "unicode-emoji";
import { copyToClipboard, pasteToCurrentWindow } from "../services/clipboard";
import { BsClipboard } from "react-icons/bs";

const emojis = unicodeEmoji.getEmojis();

export const emojiModule = new BaseModule(
  "Emojis",
  "Choose emoji!",
  "🤔"
).addPage({
  title: "Emojis",
  description: "Choose emoji!",
  icon: <>🤔</>,
  items: emojis.map((emoji) => {
    return {
      title: emoji.description,
      description: `Copy ${emoji.description}`,
      actionName: "Copiar",
      icon: <>{emoji.emoji}</>,
      onClick() {
        pasteToCurrentWindow(emoji.emoji);
      },
      auxActions: [
        {
          title: "Copy",
          description: `Copy ${emoji.emoji}`,
          actionName: "Copiar",
          icon: <BsClipboard />,
          onClick() {
            copyToClipboard(emoji.emoji);
          },
        },
      ],
    };
  }),
});
