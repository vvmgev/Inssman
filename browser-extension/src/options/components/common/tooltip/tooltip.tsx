import React, { PropsWithChildren, useId } from 'react';
import { Tooltip as ReactTooltip, ITooltip } from 'react-tooltip';

const Tooltip = ({ children, place = 'top', ...rest }: PropsWithChildren<ITooltip> ): JSX.Element => {
  const id = useId();
  return <>
    <span data-tooltip-id={id}>{children}</span>
    <ReactTooltip
        id={id}
        place={place}
        {...rest}
      />
  </>


}


export default Tooltip;
