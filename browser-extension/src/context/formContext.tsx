import { FC, PropsWithChildren, createContext, useState } from 'react';

export const FormContext = createContext({});

type Props = PropsWithChildren<{
  pageType: string,
}>

const FormContextProvider: FC<Props> = ({ pageType, children }) => {
  const [state, setState] = useState({pageType});

  return <FormContext.Provider value={{state, setState}}>
    {children}
  </FormContext.Provider>
}

export default FormContextProvider;
