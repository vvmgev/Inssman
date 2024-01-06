import dynamic from "next/dynamic";
const App = dynamic(() => import("./app"), { ssr: false });

const Main = () => <App />;

Main.displayName = "Main";

export default Main;
