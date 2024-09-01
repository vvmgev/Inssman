import { FC, PropsWithChildren, createContext, useEffect, useState } from "react";

export type FeatureToggles = {
  featureOpenWebApp: boolean;
  featureUseCache: boolean;
};
type Props = PropsWithChildren<{}>;

export const FeatureToggleContext = createContext({} as FeatureToggles);

const FeatureToggleProvider: FC<Props> = ({ children }) => {
  const [toggles, setToggles] = useState<FeatureToggles>({} as FeatureToggles);

  useEffect(() => {
    const getConfig = async () => {
      const response = await fetch("https://inssman.com/api/config");
      const data: FeatureToggles = await response.json();
      setToggles(data);
    };

    getConfig();
  }, []);

  return <FeatureToggleContext.Provider value={toggles}>{children}</FeatureToggleContext.Provider>;
};

export default FeatureToggleProvider;
