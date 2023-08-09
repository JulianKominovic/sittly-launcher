import { BsClipboard, BsEmojiSmile } from "react-icons/bs";
import { ExtensionPage } from "../../@devtools/types";
import { SittlyCommand } from "../../ui/shadcn/ui/own_command";
import * as unicodeEmoji from "unicode-emoji";
import {
  copyToClipboard,
  pasteToCurrentWindow,
} from "../../@devtools/api/clipboard";
import { useServices } from "../../@devtools/hooks/context";
const emojis = unicodeEmoji.getEmojis();

const Pages: ExtensionPage[] = [
  {
    name: "Emojis",
    route: "/emojis",
    component: () => {
      const setContextMenuOptions = useServices(
        (state) => state.setContextMenuOptions
      );
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
                onHighlight() {
                  setContextMenuOptions([
                    {
                      title: "Copy",
                      onClick() {
                        copyToClipboard(emoji.emoji);
                      },
                      description: `Copy ${emoji.emoji} to the clipboard`,
                      icon: <BsClipboard />,
                    },
                  ]);
                },
                filteringText: emoji.description,
                customChildren: (
                  <div className="flex items-center justify-center text-6xl">
                    {emoji.emoji}
                  </div>
                ),
                className: "flex items-center justify-center",
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
