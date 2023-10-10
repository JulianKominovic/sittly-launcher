import { ExtensionNoResultItems } from "../../devtools/types";
import ReactQR from "react-qr-code";
import { ErrorBoundary } from "react-error-boundary";
import {
  BsApp,
  BsCalendar2,
  BsCalendar2Date,
  BsCalendar2Day,
  BsCalendar2Month,
  BsCalendar3Fill,
  BsCalendarRange,
  BsCheckCircle,
  BsCodeSquare,
  BsGithub,
  BsGoogle,
  BsHash,
  BsKey,
  BsMicrosoft,
  BsQrCode,
  BsYoutube,
} from "react-icons/bs";
import { SiDuckduckgo, SiYoutubemusic } from "react-icons/si";
import sittlyDevtools from "../../devtools/index";
import React from "react";
import { useTodoist } from "../todoist/use-todoist";
const { hooks, utils, api } = sittlyDevtools;
const { useServices, useRouter } = hooks;
const { clipboard, shell } = api;
const { openURI } = shell;
const { pasteToCurrentWindow, copyToClipboard } = clipboard;
const SUPPORTED_HASHES = [
  "md4",
  "md5",
  "sha1",
  "sha256",
  "sha384",
  "sha512",
  "ripemd128",
  "ripemd160",
  "tiger128",
  "tiger160",
  "tiger192",
  "crc32",
  "crc32b",
];
/**
 * Extension items needs to be a function in order to use hooks
 * @returns Extension items
 */
const items: ExtensionNoResultItems = () => {
  const { goTo, location, reload } = useRouter();
  const { addTask } = useTodoist();
  const searchbarText = useServices((state) => state.searchbarText);
  const isEmail = utils.isEmail(searchbarText);
  const isBase64 = utils.isBase64(searchbarText);
  const isDate = utils.isDate(searchbarText);
  const now = Date.now();
  const base64Decoded: string = isBase64 ? atob(searchbarText) : "";
  const relativeDate = isDate
    ? utils.getRelativeTimeString(new Date(searchbarText).getTime())
    : "";
  const isJwt = utils.isJWT(searchbarText);
  const hashChecks = SUPPORTED_HASHES.map((hash) => ({
    title: "Hash detected",
    description: hash,
    icon: <BsHash />,
    mainActionLabel: "Paste",
    show: utils.isHash(searchbarText, hash as any),
  }));

  const decodedJWT = isJwt && utils.decodeJWT(searchbarText);
  const stringifiedJWT =
    isJwt && decodedJWT
      ? {
          payload: JSON.stringify(decodedJWT.payload),
          header: JSON.stringify(decodedJWT.header),
        }
      : {
          payload: "",
          header: "",
        };
  return [
    ...hashChecks,
    // Open email in fav app
    {
      onClick() {
        openURI(`mailto:${searchbarText}`);
      },
      title: "Open email",
      description: "Open " + searchbarText + " in your default app",
      icon: <BsApp />,
      mainActionLabel: "Open",
      show: isEmail,
    },
    // Send email in gmail
    {
      onClick() {
        openURI(
          "https://mail.google.com/mail/?view=cm&fs=1&to=" + searchbarText
        );
      },
      title: "Send email",
      description: "Send " + searchbarText + " in gmail",
      icon: <BsGoogle />,
      mainActionLabel: "Send",
      show: isEmail,
    },
    // Send email in outlook
    {
      onClick() {
        // Url to send email in outlook to specific email
        openURI("https://outlook.office.com/mail/compose&to=" + searchbarText);
      },
      title: "Send email",
      description: "Send " + searchbarText + " in outlook",
      icon: <BsMicrosoft />,
      mainActionLabel: "Send",
      show: isEmail,
    },

    // Paste Date to relative
    {
      onClick() {
        pasteToCurrentWindow(relativeDate);
      },
      title: "Paste relative date",
      description: relativeDate,
      icon: <BsCalendarRange />,
      mainActionLabel: "Paste",
      show: isDate,
    },

    // Paste date in millis
    {
      onClick() {
        pasteToCurrentWindow(now.toString());
      },
      title: "Paste date in millis",
      description: now.toString(),
      icon: <BsCalendar3Fill />,
      mainActionLabel: "Paste",
      show: isDate,
    },

    // Paste weekday from date from scratch (there is no util for this)
    {
      onClick() {
        pasteToCurrentWindow(
          new Date().toLocaleDateString(undefined, { weekday: "long" })
        );
      },
      title: "Paste weekday",
      description: new Date().toLocaleDateString(undefined, {
        weekday: "long",
      }),
      icon: <BsCalendar2Day />,
      mainActionLabel: "Paste",
      show: isDate,
    },

    // Paste day
    {
      onClick() {
        pasteToCurrentWindow(
          new Date().toLocaleDateString(undefined, { day: "numeric" })
        );
      },
      title: "Paste day",
      description: new Date().toLocaleDateString(undefined, {
        day: "numeric",
      }),
      icon: <BsCalendar2Date />,
      mainActionLabel: "Paste",
      show: isDate,
    },

    // Paste month
    {
      onClick() {
        pasteToCurrentWindow(
          new Date().toLocaleDateString(undefined, { month: "long" })
        );
      },
      title: "Paste month",
      description: new Date().toLocaleDateString(undefined, {
        month: "long",
      }),
      icon: <BsCalendar2Month />,
      mainActionLabel: "Paste",
      show: isDate,
    },
    // Paste year
    {
      onClick() {
        pasteToCurrentWindow(
          new Date().toLocaleDateString(undefined, { year: "numeric" })
        );
      },
      title: "Paste year",
      description: new Date().toLocaleDateString(undefined, {
        year: "numeric",
      }),
      icon: <BsCalendar2 />,
      mainActionLabel: "Paste",
      show: isDate,
    },
    // Paste decoded jwt payload
    {
      onClick() {
        pasteToCurrentWindow(stringifiedJWT?.payload);
      },
      title: "Paste decoded JWT payload",
      description: "Paste " + stringifiedJWT?.payload,
      icon: <BsKey />,
      mainActionLabel: "Paste",
      show: isJwt && Boolean(stringifiedJWT.header),
    },
    // Paste decoded jwt header
    {
      onClick() {
        pasteToCurrentWindow(stringifiedJWT?.header);
      },
      title: "Paste decoded JWT header",
      description: "Paste " + stringifiedJWT?.header,
      icon: <BsKey />,
      mainActionLabel: "Paste",
      show: isJwt && Boolean(stringifiedJWT.header),
    },
    // Base64 detection is very intrusive, so show at the end
    // Copy decoded base64
    {
      onClick() {
        copyToClipboard(base64Decoded);
      },
      title: "Copy decoded base64",
      description: "Copy " + base64Decoded,
      icon: <BsCodeSquare />,
      mainActionLabel: "Copy",
      show: isBase64,
    },
    // Paste decoded base64
    {
      onClick() {
        pasteToCurrentWindow(base64Decoded);
      },
      title: "Paste decoded base64",
      description: "Paste " + base64Decoded,
      icon: <BsCodeSquare />,
      mainActionLabel: "Paste",
      show: isBase64,
    },
    // Search on google
    {
      onClick() {
        openURI("https://google.com/search?q=" + searchbarText);
      },
      title: "Search on google",
      description: "Search " + searchbarText + " on google",
      icon: <BsGoogle />,
      mainActionLabel: "Search",
      show: true,
    },
    // Search on duckduckgo
    {
      onClick() {
        openURI("https://duckduckgo.com/?q=" + searchbarText);
      },
      title: "Search on duckduckgo",
      description: "Search " + searchbarText + " on duckduckgo",
      icon: <SiDuckduckgo className="text-amber-500" />,
      mainActionLabel: "Search",
      show: true,
    },
    // Search in youtube
    {
      onClick() {
        openURI("https://youtube.com/results?search_query=" + searchbarText);
      },
      title: "Search in youtube",
      description: "Search " + searchbarText + " in youtube",
      icon: <BsYoutube className="text-red-500" />,
      mainActionLabel: "Search",
      show: true,
    },
    // Search in github
    {
      onClick() {
        openURI("https://github.com/search?q=" + searchbarText);
      },
      title: "Search in Github",
      description: "Search " + searchbarText + " in github",
      icon: <BsGithub />,
      mainActionLabel: "Search",
      show: true,
    },
    // Search in youtube music
    {
      onClick() {
        openURI("https://music.youtube.com/search?q=" + searchbarText);
      },
      title: "Search in Youtube Music",
      description: "Search " + searchbarText + " in youtube music",
      icon: <SiYoutubemusic className="text-red-500" />,
      mainActionLabel: "Search",
      show: true,
    },

    // Add task
    {
      onClick() {
        addTask({
          due_date: Date.now(),
          title: searchbarText,
          status: "TODO",
          priority: "MEDIUM",
          description: "",
          id: crypto.randomUUID(),
        }).then(() => {
          if (location.pathname !== "/todoist") reload();
          else goTo("/todoist");
        });
      },
      title: "Create task",
      description: "Add " + searchbarText + " to todoist",
      icon: <BsCheckCircle />,
      mainActionLabel: "Create task",
    },

    // Generate QR code
    {
      customChildren: (
        <ErrorBoundary
          fallback={
            <div className="flex items-center gap-2 px-2 py-1 h-[30px]">
              <BsQrCode />
              <p>QR Code is not available</p>
            </div>
          }
        >
          <div className="flex items-center w-full gap-4 justify-evenly">
            <aside>
              <p className="text-2xl font-semibold text-slate-900">QR Code</p>
              <p className="text-sm text-slate-500">Scan with your phone</p>
            </aside>
            <ReactQR size={224} value={searchbarText} />
          </div>
        </ErrorBoundary>
      ),
    },
  ];
};
export default items;
