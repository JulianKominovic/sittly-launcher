import {
  BsBag,
  BsBoxArrowInUpLeft,
  BsClipboard,
  BsClipboard2,
  BsFile,
  BsFileBinary,
  BsFiles,
  BsFolder,
  BsFolder2Open,
  BsGlobe,
  BsLink,
  BsTrash,
} from "react-icons/bs";
import prettyBytes from "pretty-bytes";
import { ExtensionPages } from "../../devtools/types";
import { downloadExtension } from "../extension-assembly";
import React, { useDeferredValue, useEffect, useState } from "react";
import sittlyDevtools from "../../devtools/index";
import { ExtensionDatabaseModel, File } from "@/types/extension";
import { createClient } from "@supabase/supabase-js";
import { DATABASE_TABLE_NAME } from "@/config";
import { notifyAsyncOperationStatus } from "@/devtools/api/indicators";
import { ListSkeleton } from "@/devtools/components/skeletons";
import { findFiles, readFile } from "@/devtools/api/files";

import Layout from "@/devtools/components/layout";
import { useDebounce } from "usehooks-ts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/devtools/components/table";
import {
  copyImageToClipboard,
  copyToClipboard,
  pasteToCurrentWindow,
} from "@/devtools/api/clipboard";
import { homeDir, resolve } from "@tauri-apps/api/path";

const { components, hooks, api } = sittlyDevtools;
const { shell, notifications } = api;
const { sendNotification } = notifications;
const { openURI } = shell;
const { useServices, useRouter } = hooks;
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
    description: "Browse files",
    route: "/files",
    icon: <BsFiles />,
    component: () => {
      const { setContextMenuOptions, searchbarText, setSearchbarText } =
        useServices((state) => ({
          setContextMenuOptions: state.setContextMenuOptions,
          searchbarText: state.searchbarText,
          setSearchbarText: state.setSearchbarText,
        }));
      const delayedSearchbarValue = useDebounce(searchbarText, 800);
      const [filenames, setFilenames] = useState<File[]>([]);
      const [loading, setLoading] = useState(true);
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
      useEffect(() => {
        setLoading(true);
        console.log("SEARCH FILES", delayedSearchbarValue);
        findFiles({
          query: searchbarText,
          baseDir: cwd,
        })
          .then((filenames) => {
            console.log(filenames);
            setFilenames(filenames);
          })
          .finally(() => {
            setLoading(false);
          });
      }, [delayedSearchbarValue, cwd]);
      useEffect(() => {
        setLoading(true);
      }, [searchbarText]);

      if (loading) return <ListSkeleton />;
      return (
        <Layout>
          <SittlyCommand.List
            id="extensions"
            items={filenames
              .sort(
                (a, b) =>
                  b.last_modified.secs_since_epoch -
                  a.last_modified.secs_since_epoch
              )
              .map(({ is_dir, name, path, size, file_type }) => {
                return {
                  title: name,
                  description: prettyBytes(size),
                  icon: is_dir ? <BsFolder /> : <BsFile />,
                  onClick() {
                    if (loading) return;
                    openURI(path, "xdg-open");
                  },
                  mainActionLabel: "Open",
                  onHighlight() {
                    if (loading) return;

                    setContextMenuOptions([
                      ...(is_dir
                        ? [
                            {
                              title: "Go to",
                              icon: <BsFolder2Open />,
                              description: path,
                              mainActionLabel: "Go to",
                              onClick() {
                                setCwd(path);
                                setSearchbarText("");
                              },
                            },
                          ]
                        : []),
                      {
                        title: "Open",
                        icon: <BsBoxArrowInUpLeft />,
                        mainActionLabel: "Open",
                        description: path,
                        onClick() {
                          openURI(path, "xdg-open");
                        },
                      },
                      {
                        title: "Copy image to clipboard",
                        icon: <BsClipboard2 />,
                        description: path,
                        onClick() {
                          copyImageToClipboard(
                            path,
                            file_type === "png"
                              ? "png"
                              : file_type === "svg"
                              ? "svg+xml"
                              : file_type === "avif"
                              ? "avif"
                              : "jpeg"
                          );
                        },
                        mainActionLabel: "Copy image to clipboard",
                      },
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

                    readFile({ path }).then(
                      ({ base64, file_type, is_dir, ...rest }) => {
                        if (!base64)
                          return setPreview({
                            ...rest,
                            is_dir,
                            base64: "",
                            file_type: is_dir ? "dir" : "",
                          });
                        if (!file_type)
                          return setPreview({
                            ...rest,
                            is_dir,
                            base64: "",
                            file_type: is_dir ? "dir" : "",
                          });
                        if (IMAGES_SUPPORTED.some((ext) => ext === file_type)) {
                          if (file_type === "svg") {
                            setPreview({
                              ...rest,
                              is_dir,
                              base64,
                              file_type: "svg+xml",
                            });
                            return;
                          }
                          setPreview({
                            ...rest,
                            is_dir,
                            base64,
                            file_type,
                          });
                          return;
                        }
                        setPreview({
                          ...rest,
                          is_dir,
                          base64: "",
                          file_type,
                        });
                      }
                    );
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
                  <TableRow className="m-0">
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
