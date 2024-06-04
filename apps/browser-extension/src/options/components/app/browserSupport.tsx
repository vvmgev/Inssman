import BrowserSupportService from "@services/BrowserSupportService";
import Section from "@options/components/common/section/section";

const BrowserSupport = ({ children }) => {
  if (BrowserSupportService.isSupportRules()) {
    return children;
  }
  return (
    <Section classes="mx-[5%]">
      <div className="py-5 px-5 text-lg w-full mx-[5%]">
        <div className="mb-5">Please Update Your Browser Version</div>
        <div className="text-sm text-gray-500">
          Seems your are using an old version. The extension utilizes the latest APIs.
        </div>
        <div className="text-sm text-gray-500">Please update your browser version to access all features.</div>
      </div>
    </Section>
  );
};

export default BrowserSupport;
