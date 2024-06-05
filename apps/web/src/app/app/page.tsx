"use client";
import Loading from "@/components/loading/loading";
import Sidebar from "@/components/sidebar/sidebar";
import InstallExtension from "@/components/installExtension/installExtension";
import { useEffect, useState } from "react";

export default function App() {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsExtensionInstalled(true);
    }, 2000);
  }, []);

  return (
    <main
      className="w-screen h-screen overflow-hidden bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
    text-gray-300 text-sm relative p-1"
    >
      {isExtensionInstalled ? (
        <div className="flex w-full h-full gap-2">
          <Sidebar />
          <InstallExtension />
        </div>
      ) : (
        <Loading />
      )}
    </main>
  );
}
