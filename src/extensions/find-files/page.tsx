import {
  BsBoxArrowInUpLeft,
  BsClipboard,
  BsClipboard2,
  BsClipboard2Plus,
  BsFileBinary,
  BsFiles,
  BsFolder,
} from "react-icons/bs";
import prettyBytes from "pretty-bytes";
import { ExtensionPages } from "../../devtools/types";
import React, { useDeferredValue, useEffect, useState } from "react";
import sittlyDevtools from "../../devtools/index";
import { File } from "@/devtools/types/models";
import { readDir, readFile } from "@/devtools/api/files";

import Layout from "@/devtools/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/devtools/components/table";
import {
  copyImageToClipboard,
  copyToClipboard,
  pasteToCurrentWindow,
} from "@/devtools/api/clipboard";
import { homeDir } from "@tauri-apps/api/path";
import { useDebounceFunction } from "@/devtools/lib/utils";

const { components, hooks, api } = sittlyDevtools;
const { shell } = api;
const { openURI } = shell;
const { useServices } = hooks;
const { Command: SittlyCommand } = components;

const IMAGES_SUPPORTED = [
  "ase",
  "art",
  "bmp",
  "blp",
  "cd5",
  "cit",
  "cpt",
  "cr2",
  "cut",
  "dds",
  "dib",
  "djvu",
  "egt",
  "exif",
  "gif",
  "gpl",
  "grf",
  "icns",
  "ico",
  "iff",
  "jng",
  "jpeg",
  "jpg",
  "jfif",
  "jp2",
  "jps",
  "lbm",
  "max",
  "miff",
  "mng",
  "msp",
  "nef",
  "nitf",
  "ota",
  "pbm",
  "pc1",
  "pc2",
  "pc3",
  "pcf",
  "pcx",
  "pdn",
  "pgm",
  "PI1",
  "PI2",
  "PI3",
  "pict",
  "pct",
  "pnm",
  "pns",
  "ppm",
  "psb",
  "psd",
  "pdd",
  "psp",
  "px",
  "pxm",
  "pxr",
  "qfx",
  "raw",
  "rle",
  "sct",
  "sgi",
  "rgb",
  "int",
  "bw",
  "tga",
  "tiff",
  "tif",
  "vtf",
  "xbm",
  "xcf",
  "xpm",
  "3dv",
  "amf",
  "ai",
  "awg",
  "cgm",
  "cdr",
  "cmx",
  "dxf",
  "e2d",
  "egt",
  "eps",
  "fs",
  "gbr",
  "odg",
  "svg",
  "stl",
  "vrml",
  "x3d",
  "sxd",
  "v2d",
  "vnd",
  "wmf",
  "emf",
  "art",
  "xar",
  "png",
  "webp",
  "jxr",
  "hdp",
  "wdp",
  "cur",
  "ecw",
  "iff",
  "lbm",
  "liff",
  "nrrd",
  "pam",
  "pcx",
  "pgf",
  "sgi",
  "rgb",
  "rgba",
  "bw",
  "int",
  "inta",
  "sid",
  "ras",
  "sun",
  "tga",
  "heic",
  "heif",
  "svg+xml",
];

const home = await homeDir();

const pages: ExtensionPages = [
  {
    name: "Files",
    description: "File explorer",
    route: "/files",
    icon: <BsFiles />,
    component: () => {
      const { setContextMenuOptions, setSearchbarText } = useServices(
        (state) => ({
          setContextMenuOptions: state.setContextMenuOptions,
          setSearchbarText: state.setSearchbarText,
        })
      );
      const [filenames, setFilenames] = useState<File[]>([]);
      const [cwd, setCwd] = useState<string>(home);
      const [_preview, setPreview] = useState<File>({
        base64: "",
        size: 0,
        file_type: "",
        is_dir: false,
        last_modified: {
          secs_since_epoch: 0,
        },
        name: "",
        path: "",
      });
      const preview = useDeferredValue(_preview);

      const { debounce } = useDebounceFunction(400);

      useEffect(() => {
        readDir({
          path: cwd,
        }).then((filenames) => {
          setFilenames(
            filenames.sort(
              (a, b) =>
                b.last_modified.secs_since_epoch -
                a.last_modified.secs_since_epoch
            )
          );
          setPreview(filenames[0]);
        });
      }, [cwd]);

      function handleOnHighlight(path: string) {
        debounce(() =>
          readFile({ path }).then(
            ({ base64, file_type, is_dir, path, name, ...rest }) => {
              const content = atob(base64);
              setContextMenuOptions([
                {
                  title: "Open",
                  icon: <BsBoxArrowInUpLeft />,
                  mainActionLabel: "Open",
                  description: path,
                  onClick() {
                    openURI(path, "xdg-open");
                  },
                },
                ...(IMAGES_SUPPORTED.includes(file_type)
                  ? [
                      {
                        title: "Copy image to clipboard",
                        icon: <BsClipboard2 />,
                        description: path,
                        onClick() {
                          copyImageToClipboard(path);
                        },
                        mainActionLabel: "Copy image to clipboard",
                      },
                    ]
                  : base64
                  ? [
                      {
                        title: "Copy content to clipboard",
                        icon: <BsClipboard2Plus />,
                        description: content,
                        onClick() {
                          copyToClipboard(content);
                        },
                        mainActionLabel: "Copy image to clipboard",
                      },

                      {
                        title: "Paste content to app",
                        icon: <BsClipboard2Plus />,
                        description: content,
                        onClick() {
                          pasteToCurrentWindow(content);
                        },
                        mainActionLabel: "Copy image to clipboard",
                      },
                    ]
                  : []),

                {
                  title: "Copy path",
                  icon: <BsClipboard />,
                  description: path,
                  onClick() {
                    copyToClipboard(path);
                  },
                  mainActionLabel: "Copy path",
                },
                {
                  title: "Copy filename",
                  icon: <BsClipboard />,
                  description: name,
                  onClick() {
                    copyToClipboard(name);
                  },
                  mainActionLabel: "Copy filename",
                },
              ]);

              if (!base64)
                return setPreview({
                  ...rest,
                  is_dir,
                  name,
                  path,
                  base64: "",
                  file_type: is_dir ? "dir" : "",
                });
              if (!file_type)
                return setPreview({
                  ...rest,
                  is_dir,
                  name,
                  path,
                  base64: "",
                  file_type: is_dir ? "dir" : "",
                });
              if (IMAGES_SUPPORTED.some((ext) => ext === file_type)) {
                if (file_type === "svg") {
                  setPreview({
                    ...rest,
                    is_dir,
                    name,
                    path,
                    base64,
                    file_type: "svg+xml",
                  });
                  return;
                }
                setPreview({
                  ...rest,
                  is_dir,
                  name,
                  path,
                  base64,
                  file_type,
                });
                return;
              }
              setPreview({
                ...rest,
                is_dir,
                name,
                path,
                base64: "",
                file_type,
              });
            }
          )
        );
      }

      return (
        <Layout>
          <SittlyCommand.List
            id="extensions"
            items={filenames.map(({ is_dir, name, path, size }) => {
              return {
                title: name,
                description: prettyBytes(size),
                icon: is_dir ? <BsFolder /> : <BsFileBinary />,
                onClick() {
                  if (is_dir) {
                    setCwd(path);
                    setSearchbarText("");
                  } else {
                    openURI(path, "xdg-open");
                  }
                },
                mainActionLabel: is_dir ? "Go to" : "Open file",
                onHighlight() {
                  handleOnHighlight(path);
                },
              };
            })}
          />
          <div className="flex flex-col gap-4">
            {IMAGES_SUPPORTED.some((img) => img === preview.file_type) ? (
              <img
                src={`data:image/${preview.file_type};base64, ${preview.base64}`}
                alt=""
                className="w-auto h-full mx-auto mt-2 rounded-lg max-h-40"
              />
            ) : preview.file_type === "dir" ? (
              <BsFolder className="w-auto h-full mx-auto mt-2 max-h-40" />
            ) : (
              <BsFileBinary className="w-auto h-full mx-auto mt-2 max-h-40" />
            )}
            <Table>
              <TableBody className="h-full overflow-hidden">
                {[
                  ["Name", preview.name],
                  ["Path", preview.path],
                  ["Type", preview.file_type],

                  ["Size", prettyBytes(preview.size)],
                  [
                    "Last modified",
                    new Date(
                      preview.last_modified.secs_since_epoch * 1000
                    ).toUTCString(),
                  ],
                ].map(([key, value]) => (
                  <TableRow key={key} className="m-0">
                    <TableCell className="min-w-[14ch] font-semibold text-neutral-800">
                      {key}
                    </TableCell>
                    <TableCell className="break-all whitespace-break-spaces">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Layout>
      );
    },
  },
];
export default pages;
