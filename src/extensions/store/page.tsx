import { BsBag, BsGlobe, BsTrash } from "react-icons/bs";
import { ExtensionPages } from "../../devtools/types";
import { downloadExtension } from "../extension-assembly";
import React, { useEffect, useState } from "react";
import sittlyDevtools from "../../devtools/index";
import { ExtensionDatabaseModel } from "@/types/extension";
import { createClient } from "@supabase/supabase-js";
import { DATABASE_TABLE_NAME } from "@/config";
import { notifyAsyncOperationStatus } from "@/devtools/api/indicators";
import { ListSkeleton } from "@/devtools/components/skeletons";

const { components, hooks, api } = sittlyDevtools;
const { shell, notifications } = api;
const { sendNotification } = notifications;
const { openURI } = shell;
const { useServices, useRouter } = hooks;
const { Command: SittlyCommand } = components;
const pages: ExtensionPages = [
  {
    name: "Store",
    description: "Download new extensions",
    route: "/store",
    icon: <BsBag />,
    component: () => {
      const { goToHome } = useRouter();
      const setContextMenuOptions = useServices(
        (state) => state.setContextMenuOptions
      );
      const [extensions, setExtensions] = useState<ExtensionDatabaseModel[]>(
        []
      );
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        async function fetchExtensions() {
          notifyAsyncOperationStatus({
            title: "Loading",
            status: "IN_PROGRESS",
            description: "wait while we fetch extensions",
          });
          const { data, error } = await createClient(
            import.meta.env.VITE_DB_REST_URL,
            import.meta.env.VITE_ANON_PUBLIC_KEY
          )
            .from(DATABASE_TABLE_NAME)
            .select()
            .not(
              "url",
              "in",
              `(${window.__SITTLY_EXTENSIONS__
                ?.map((e) => e.metadata.repoUrl)
                .join(",")})`
            );

          setLoading(false);
          if (error) {
            notifyAsyncOperationStatus({
              title: "Error",
              status: "ERROR",
              description: "while fetching extensions",
            });
            return sendNotification({
              title: "Error",
              body: "Error getting extensions",
              icon: "sync-error",
            });
          }

          notifyAsyncOperationStatus({
            title: "Extensions loaded",
            status: "SUCCESS",
            description: "extensions loaded successfully",
          });
          const extensionsGet = data as ExtensionDatabaseModel[];
          setExtensions(extensionsGet);
        }
        fetchExtensions();
      }, []);

      if (loading) return <ListSkeleton />;
      return (
        <SittlyCommand.List
          id="extensions"
          items={extensions.map(
            ({ author, body, icon_url, name, url }: ExtensionDatabaseModel) => {
              const textOverflow =
                body.length > 30 ? `${body.slice(0, 30)}...` : body;
              return {
                title: name,
                description: `${textOverflow} from ${author}`,
                icon: <img className="rounded-lg" src={icon_url} alt={name} />,
                onClick() {
                  if (loading) return;
                  setLoading(true);
                  downloadExtension(url)
                    .then(() => {
                      goToHome();
                      location.reload();
                    })
                    .finally(() => setLoading(false));
                },
                onHighlight() {
                  setContextMenuOptions([
                    {
                      title: "Install",
                      description: "Install extension",
                      icon: <BsTrash />,
                      onClick() {
                        if (loading) return;
                        setLoading(true);

                        downloadExtension(url)
                          .then(() => {
                            goToHome();

                            location.reload();
                          })
                          .finally(() => setLoading(false));
                      },
                    },
                    {
                      title: "Open in browser",
                      description: "Open extension in browser",
                      icon: <BsGlobe />,
                      onClick() {
                        openURI(url);
                      },
                    },
                  ]);
                },
              };
            }
          )}
        />
      );
    },
  },
];
export default pages;
