import React from "react";

export type ThemeInterface = {
  [key: string]: any;
};

interface AppContextInterface {
  theme: ThemeInterface;
}

const AppContext = React.createContext<AppContextInterface>({ theme: {} });

export default AppContext;
