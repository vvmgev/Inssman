import { PropsWithChildren } from "react";
import RCTooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";

const Tooltip = ({
  children,
  place = "top",
  content,
  overlayInnerStyle = {},
  ...rest
}: PropsWithChildren<any>): JSX.Element => {
  return (
    <RCTooltip
      placement={place}
      overlay={content}
      overlayInnerStyle={{
        background: "#0F172A",
        color: "white",
        ...overlayInnerStyle,
      }}
      {...rest}
    >
      {children}
    </RCTooltip>
  );
};

export default Tooltip;
