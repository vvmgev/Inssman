import { FC, ReactElement } from "react";
import { Link } from "react-router-dom";

type Props = {
  url: string;
  title: string | ReactElement;
  icon: ReactElement;
  active?: boolean;
  locationState?: Record<string, unknown>;
};

const SidebarItem: FC<Props> = ({ url, title, icon, locationState, active = false }) => {
  return (
    <li className="pl-2 mb-2">
      <Link to={url} state={locationState}>
        <div className={`${active ? "text-sky-500" : ""} flex items-center hover:text-sky-500 gap-2`}>
          <span className="min-w-[24px]">{icon}</span>
          <span>{title}</span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
