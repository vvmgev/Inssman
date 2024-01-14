import { FC, PropsWithChildren, createContext, useState } from "react";

type SidebarContextValue = {
  full: boolean;
  setFull: (checked: boolean) => void;
};

export const SidebarContext = createContext({} as SidebarContextValue);

type Props = PropsWithChildren<{}>;

const SidebarContextProvider: FC<Props> = ({ children }) => {
  const [full, setFull] = useState<boolean>(true);

  return <SidebarContext.Provider value={{ full, setFull }}>{children}</SidebarContext.Provider>;
};

export default SidebarContextProvider;
