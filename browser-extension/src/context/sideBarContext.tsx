import { FC, PropsWithChildren, createContext, useState } from 'react';

type SideBarContextValue = {
  full: boolean;
  setFull: (checked: boolean) => void
}


export const SideBarContext = createContext({} as SideBarContextValue);

type Props = PropsWithChildren<{}>

const SideBarContextProvider: FC<Props> = ({ children }) => {
  const [full, setFull] = useState<boolean>(true);

  return <SideBarContext.Provider value={{full, setFull}}>
    {children}
  </SideBarContext.Provider>
}

export default SideBarContextProvider;
