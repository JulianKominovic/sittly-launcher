// import React, { useState } from "react";
// import sittlyDevtools from "../devtools/index";

// import { ContextTypes } from "../devtools/types";
// import { ListItem, MusicServiceReturn } from "../devtools/types";
// const { hooks } = sittlyDevtools;
// const { default: ServicesContext } = hooks;
// const ServicesContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [context, setContext] = useState<
//     Pick<
//       ContextTypes,
//       | "music"
//       | "contextMenuOptions"
//       | "isContextMenuOpen"
//       | "searchbarText"
//       | "initialContextMenuOptions"
//     >
//   >({
//     music: {
//       title: "",
//       artist: "",
//       album: "",
//       remainingMillis: 0,
//       currentMillis: 0,
//       durationMillis: 0,
//       status: "Stopped",
//     },

//     contextMenuOptions: [],
//     isContextMenuOpen: false,
//     searchbarText: "",
//     initialContextMenuOptions: [],
//   });
//   const setMusic = (music: MusicServiceReturn) => {
//     setContext((prev) => ({ ...prev, music }));
//   };
//   const setContextMenuOptions = (contextMenuOptions: ListItem[]) => {
//     setContext((prev) => ({
//       ...prev,
//       contextMenuOptions: [
//         ...context.initialContextMenuOptions,
//         ...contextMenuOptions,
//       ],
//     }));
//   };
//   const setContextMenuIsOpen = (isContextMenuOpen: boolean) => {
//     setContext((prev) => ({ ...prev, isContextMenuOpen }));
//   };
//   const setSearchbarText = (searchbarText: string) => {
//     setContext((prev) => ({ ...prev, searchbarText }));
//   };
//   const setInitialContextMenuOptions = (initialContextMenuOptions: any) => {
//     setContext((prev) => ({ ...prev, initialContextMenuOptions }));
//   };
//   return (
//     <ServicesContext.Provider
//       value={{
//         ...context,
//         setMusic,
//         setContextMenuOptions,
//         setContextMenuIsOpen,
//         setSearchbarText,
//         setInitialContextMenuOptions,
//       }}
//     >
//       {children}
//     </ServicesContext.Provider>
//   );
// };

// export { ServicesContextProvider, ServicesContext };
