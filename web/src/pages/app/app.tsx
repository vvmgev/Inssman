import { useEffect, useState } from "react";
import "./app.css";
import Loading from "./components/loading/loading";
import SharedRecordedSession from "./components/sharedRecordedSession/SharedRecordedSession";
import { useParams, usePathname } from "next/navigation";
import { isSharedRecordedSessionPath } from "./utils/isSharedRecordedSessionPath";
import dammySession from "./session";

export default function App() {
  const params = useParams<any>();
  const pathname = usePathname();
  const slug = params.slug;
  const isSharedRecordedSession = isSharedRecordedSessionPath(pathname as string);
  console.log(slug);
  console.log(pathname);
  console.log(isSharedRecordedSession);
  const [session, setSession] = useState<any>();
  // @ts-ignore
  const isExtensionInstalled = globalThis?.INSSMAN?.isExtensionInstalled;

  useEffect(() => {
    const getSession = async () => {
      if (isSharedRecordedSession) {
        const id = slug[slug.length - 1];
        console.log(id);
        setSession(dammySession);
      }
    };
    getSession();
  }, []);

  return (
    <main
      className="w-full h-[100vh] bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
    text-gray-300 text-sm relative p-4"
    >
      {isExtensionInstalled ? (
        <Loading />
      ) : isSharedRecordedSession ? (
        <SharedRecordedSession session={session} />
      ) : null}
    </main>
  );
}
