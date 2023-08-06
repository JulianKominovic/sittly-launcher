import { BsEmojiSmile } from "react-icons/bs";
import { ExtensionPage } from "../../types/extensions";
import { SittlyCommand } from "../../ui/shadcn/ui/own_command";
import * as unicodeEmoji from "unicode-emoji";
import { pasteToCurrentWindow } from "../../services/clipboard";
import { useState } from "react";
const emojis = unicodeEmoji.getEmojis();

const Pages: ExtensionPage[] = [
  {
    name: "Emojis",
    route: "/emojis",
    component: () => {
      return (
        <SittlyCommand.Root>
          <SittlyCommand.Grid
            id="emojis-page-list"
            columns={4}
            items={emojis.map((emoji) => {
              return {
                onClick() {
                  pasteToCurrentWindow(emoji.emoji);
                },
                filteringText: emoji.description,
                customChildren: <>{emoji.emoji}</>,
              };
            })}
          />
        </SittlyCommand.Root>
      );
    },
    description: "A collection of emojis",
    icon: <BsEmojiSmile />,
  },
];
export default Pages;
