import Section from "@options/components/common/section/section";
import Button from "@options/components/common/button/button";
import { ReactElement, FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = (): ReactElement => {
  return (
    <Section classes="mx-[5%] p-5 min-h-[300px]">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">We Lost This Page</span>
          </div>
        </div>

        <div className="leading-7 text-slate-400">
          <p>
            The Info You're Looking For Can't Be Found. <br />
            You Might Want To Try Explore one Of The Links In The Left Sidebar.
          </p>
          <p>
            Or Navigate To{" "}
            <Link to="/">
              <Button trackName="404">Main Page</Button>
            </Link>
          </p>
        </div>
        <div className="flex justify-center w-full">
          <span className="px-2 tracking-widest text-white rounded bg-sky-600 text-9xl">404</span>
        </div>
      </div>
    </Section>
  );
};

export default NotFound;
