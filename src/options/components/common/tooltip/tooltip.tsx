import React, { PropsWithChildren, useId } from 'react';
import { Tooltip as ReactTooltip, ITooltip } from 'react-tooltip';

const Tooltip = ({ children, place = 'top', ...rest }: PropsWithChildren<ITooltip> ): JSX.Element => {
  const id = useId();
  return <>
    {React.cloneElement(children as any, { 'data-tooltip-id': id })}
    <ReactTooltip
        id={id}
        className="tooltip tooltip-content"
        place={place}
        {...rest}
      />
  </>


}


export default Tooltip;
