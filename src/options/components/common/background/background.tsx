import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{}>

const Background = ({children}: Props) => <div className="bg-[linear-gradient(140deg,_rgba(15,_23,_42,_1)_0%,_rgba(15,_23,_42,_1)_39%,_rgba(42,_61,_108,_1)_80%)]
      text-gray-300 text-sm w-full h-full relative">
        {children}
    </div>;

export default Background;
