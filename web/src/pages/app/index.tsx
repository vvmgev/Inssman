import dynamic from "next/dynamic";
const App = dynamic(() => import("./app"), { ssr: false });

export default () => <App />;
