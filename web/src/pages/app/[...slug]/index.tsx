import dynamic from "next/dynamic";
const App = dynamic(() => import("../app"), { ssr: false });
const Slug = () => <App />;

Slug.displayName = "Slug";

export default Slug;
