"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  const pathArr = pathname?.split("/") || [];
  const fileName = pathArr[pathArr.length - 1];
  const Doc = dynamic(() => import(`../files/${fileName}.mdx`));
  return <Doc />;
};

export default Page;
