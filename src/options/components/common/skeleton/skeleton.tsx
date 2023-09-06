import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{}>

const TempSkeleton = ({children}) => <div className="h-[150px] min-h-[350px] mt-[100px]">{children}</div>;
export default TempSkeleton;