import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type FeatureToggleValue = Record<string, boolean>;
type Props = PropsWithChildren<{}>;

export const FeatureToggleContext = createContext({
  toggles: {} as FeatureToggleValue,
});

const FeatureToggleProvider: FC<Props> = ({ children }) => {
  const [toggles, setToggles] = useState<FeatureToggleValue>({});

  useEffect(() => {
    const getConfig = async () => {
      const response = await fetch("https://inssman.com/api/config");
      const data = await response.json();
      setToggles(data.featureToggles);
    };

    getConfig();
  }, []);

  return (
    <FeatureToggleContext.Provider value={{ toggles }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export default FeatureToggleProvider;
