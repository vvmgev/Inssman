import ColorCover from '../common/colorCover/colorCover';

function BrowserSupport() {
  return (
    <ColorCover classes="mx-[5%]">
      <div className="py-5 px-5 text-lg w-full mx-[5%]">
        <div className="mb-5">Please Update Your Browser Version</div>
        <div className="text-sm text-gray-500">Seems your are using an old version. The extension utilizes the latest APIs.</div>
        <div className="text-sm text-gray-500">Please update your browser version to access all features.</div>
      </div>
    </ColorCover>
  );
}

export default BrowserSupport;
