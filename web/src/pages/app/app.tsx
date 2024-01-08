import Loading from "../../components/loading/loading";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { isSharedRecordedSessionPath } from "../../utils/isSharedRecordedSessionPath";
import SideBar from "../../components/sidebar/sidebar";
import SharedRecordedSession from "../../components/sharedRecordedSession/sharedRecordedSession";
import InstallExtension from "../../components/installExtension/installExtension";
import { getRecordedSessionByID } from "../../config/firebase";
import "./app.css";

export default function App() {
  const [error, setError] = useState<string>();
  const params = useParams<any>();
  const pathname = usePathname() || "";
  const slug = params?.slug;
  const isSharedRecordedSession = isSharedRecordedSessionPath(pathname as string);
  const [session, setSession] = useState<any>();
  // @ts-ignore
  const isExtensionInstalled = globalThis?.INSSMAN?.isExtensionInstalled;

  useEffect(() => {
    const getSession = async () => {
      console.log("isSharedRecordedSession", pathname, isSharedRecordedSession);
      if (isSharedRecordedSession) {
        try {
          const id = slug[slug.length - 1];
          const session = await getRecordedSessionByID(id);
          if (session.events?.length > 1) {
            setSession(session);
          }
        } catch (error: any) {
          setError(error.message);
        }
      }
    };

    getSession();
  }, [pathname]);

  return (
    <main
      className="w-screen h-screen overflow-hidden bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
    text-gray-300 text-sm relative p-1"
    >
      {isExtensionInstalled ? (
        <Loading />
      ) : (
        <div className="flex w-full h-full gap-2">
          <SideBar />
          {isSharedRecordedSession ? <SharedRecordedSession session={session} error={error} /> : <InstallExtension />}
        </div>
      )}
    </main>
  );
}
